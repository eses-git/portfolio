import React, { useRef, useEffect, type PropsWithChildren } from 'react';

// The wrapper component for the animated background
export const InteractiveWavesBackground: React.FC<PropsWithChildren> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        let animationFrameId: number;
        let waveBundles: WaveBundle[] = [];
        const mousePos = { x: -1000, y: -1000 };

        // --- OPTIMIZATION: Helper to check for mobile screen size ---
        const isMobile = () => window.innerWidth <= 768;

        // Track previous dimensions to detect meaningful changes
        let prevWidth = window.innerWidth;

        class WaveBundle {
            baseY: number;
            numLines: number;
            interactionSpread: number; // The spread when mouse is near
            baseSpread: number; // The default, tighter spread
            currentSpread: number; // The animated spread value
            guideWaveAmplitude: number;
            guideWaveFrequency: number;
            spreadWaveFrequency: number;
            phase: number;
            speed: number;

            constructor(y: number) {
                this.baseY = y;
                
                // --- OPTIMIZATION: Use different settings for mobile vs. desktop ---
                if (isMobile()) {
                    // --- MOBILE SETTINGS ---
                    this.numLines = Math.floor(Math.random() * 5) + 8; // 8-13 lines
                    this.interactionSpread = Math.random() * 110 + 80; // 100-220
                    this.baseSpread = Math.random() * 15 + 15; // 20-40
                    this.guideWaveAmplitude = Math.random() * 40 + 30; // 30-70
                    this.guideWaveFrequency = (Math.random() * 0.003) + 0.001; // 0.001-0.004
                    this.speed = (Math.random() * 0.005) + 0.002; // 0.002-0.007
                } else {
                    // --- DESKTOP SETTINGS ---
                    this.numLines = Math.floor(Math.random() * 10) + 10; // 10-20 lines
                    this.interactionSpread = Math.random() * 100 + 60; // 60-160
                    this.baseSpread = Math.random() * 20 + 10; // 10-30
                    this.guideWaveAmplitude = Math.random() * 100 + 60; // 60-160
                    this.guideWaveFrequency = (Math.random() * 0.005) + 0.002; // 0.002-0.007
                    this.speed = (Math.random() * 0.005) + 0.001; // 0.001-0.006
                }
                
                this.currentSpread = this.baseSpread;
                this.spreadWaveFrequency = (Math.random() * 0.01) + 0.005;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(mousePosition: {x: number, y: number}) {
                this.phase += this.speed;

                const guideYAtMouseX = Math.sin(mousePosition.x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const distanceToMouse = Math.abs(guideYAtMouseX - mousePosition.y);
                const spreadRadius = 150; 

                const targetSpread = distanceToMouse < spreadRadius ? this.interactionSpread : this.baseSpread;
                this.currentSpread += (targetSpread - this.currentSpread) * 0.05;
            }

            draw(context: CanvasRenderingContext2D, canvasWidth: number, mousePosition: {x: number, y: number}) {
                context.strokeStyle = `rgba(19, 104, 133, 0.4)`;
                context.lineWidth = 0.5;
                
                const segmentLength = 10; 

                for (let i = 0; i < this.numLines; i++) {
                    context.beginPath();
                    context.moveTo(0, this.calculateY(0, i, mousePosition));
                    
                    for (let x = segmentLength; x < canvasWidth; x += segmentLength) {
                        context.lineTo(x, this.calculateY(x, i, mousePosition));
                    }
                    context.lineTo(canvasWidth, this.calculateY(canvasWidth, i, mousePosition));
                    
                    context.stroke();
                }
            }

            calculateY(x: number, lineIndex: number, mousePosition: {x: number, y: number}): number {
                const guideY = Math.sin(x * this.guideWaveFrequency + this.phase) * this.guideWaveAmplitude + this.baseY;
                const spreadModulator = Math.pow(Math.sin(x * this.spreadWaveFrequency + this.phase), 2);
                const lineOffset = (lineIndex / (this.numLines - 1) - 0.5) * 2 * this.currentSpread;
                let finalY = guideY + lineOffset * spreadModulator;

                const dx = x - mousePosition.x;
                const dy = finalY - mousePosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 200;
                const maxDisplacement = 80;

                if (distance < interactionRadius) {
                    const force = 1 - (distance / interactionRadius);
                    const displacement = force * maxDisplacement;
                    finalY -= displacement;
                }
                return finalY;
            }
        }

        const init = (fullReinit: boolean) => {
            const canvasHeight = canvas.height;
            const numBundles = isMobile() ? 8 : 6;

            if (fullReinit || waveBundles.length !== numBundles) {
                waveBundles = [];
                for (let i = 0; i < numBundles; i++) {
                    const y = (canvasHeight / numBundles) * i + (canvasHeight / numBundles / 2);
                    waveBundles.push(new WaveBundle(y));
                }
            } else {
                waveBundles.forEach((bundle, i) => {
                    bundle.baseY = (canvasHeight / numBundles) * i + (canvasHeight / numBundles / 2);
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            waveBundles.forEach(bundle => {
                bundle.update(mousePos); 
                bundle.draw(ctx, canvas.width, mousePos);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleInteractionMove = (event: MouseEvent | TouchEvent) => {
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                let clientX = 0;
                let clientY = 0;

                if ('touches' in event) {
                    if (event.touches.length > 0) {
                        clientX = event.touches[0].clientX;
                        clientY = event.touches[0].clientY;
                    }
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                mousePos.x = clientX - rect.left;
                mousePos.y = clientY - rect.top;
            }
        };

        const handleInteractionEnd = () => {
            mousePos.x = -1000;
            mousePos.y = -1000;
        };

        // Set canvas drawing size to match window
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            canvas.width = newWidth;
            canvas.height = newHeight;

            const fullReinit = Math.abs(newWidth - prevWidth) > 0;
            init(fullReinit);

            prevWidth = newWidth;
        };
        
        // Listeners for window interactions
        window.addEventListener('mousemove', handleInteractionMove);
        window.addEventListener('mouseleave', handleInteractionEnd);

        window.addEventListener('touchstart', handleInteractionMove, { passive: true });
        window.addEventListener('touchmove', handleInteractionMove, { passive: true });
        window.addEventListener('touchend', handleInteractionEnd);
        window.addEventListener('touchcancel', handleInteractionEnd);

        window.addEventListener('resize', handleResize);
        
        // Initial setup
        handleResize();
        animate();

        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseleave', handleInteractionEnd);
            
            window.removeEventListener('touchstart', handleInteractionMove);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
            window.removeEventListener('touchcancel', handleInteractionEnd);

            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        <div className="relative overflow-hidden w-full bg-[#F8F9FA]">
            {/* 
              fixed z-0 backdrop canvas paired with pointer-events-none 
              so user clicks/taps hit interactive UI elements underneath
            */}
            <canvas 
                ref={canvasRef} 
                className="pointer-events-none fixed top-0 left-0 w-screen h-screen opacity-80 z-0"
            />
            
            {/* Content wrapper elevated above canvas */}
            <div className="relative z-10 w-full opacity-[0.99]">
                {children}
            </div>
        </div>
    );
};