'use client';

import { globals } from '@/app/globals';
import { useEffect, useRef } from 'react';

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    class Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      brightness: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5;
        this.brightness = Math.random();
      }

      update() {
        this.y += this.speed;
        if (this.y > this.canvasHeight) {
          this.y = 0;
          this.x = Math.random() * this.canvasWidth;
        }
      }

      resize(newWidth: number, newHeight: number) {
        const widthRatio = newWidth / this.canvasWidth;
        const heightRatio = newHeight / this.canvasHeight;
        
        this.x *= widthRatio;
        this.y *= heightRatio;
        
        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 96, 126, ${this.brightness})`;
        ctx.fill();
      }
    }

    class ShootingStar {
      x: number = 0;
      y: number = 0;
      length: number;
      speed: number;
      angle: number = 0;
      brightness: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        const startEdge = Math.floor(Math.random() * 4);
        
        switch (startEdge) {
          case 0:
            this.x = Math.random() * this.canvasWidth;
            this.y = 0;
            this.angle = Math.PI / 4 + (Math.random() * Math.PI / 2);
            break;
          case 1:
            this.x = this.canvasWidth;
            this.y = Math.random() * this.canvasHeight;
            this.angle = Math.PI / 2 + (Math.random() * Math.PI / 2);
            break;
          case 2:
            this.x = Math.random() * this.canvasWidth;
            this.y = this.canvasHeight;
            this.angle = Math.PI + (Math.random() * Math.PI / 2);
            break;
          case 3:
            this.x = 0;
            this.y = Math.random() * this.canvasHeight;
            this.angle = (Math.random() * Math.PI / 2) + (Math.PI * 1.5);
            break;
        }

        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 15 + 10;
        this.brightness = 1;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.brightness -= 0.02;

        return this.x > -this.length && 
               this.x < this.canvasWidth + this.length && 
               this.y > -this.length && 
               this.y < this.canvasHeight + this.length && 
               this.brightness > 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    for (let i = 0; i < globals.star_count; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    const spawnShootingStar = () => {
      shootingStars.push(new ShootingStar(canvas.width, canvas.height));
    };

    const spawnInterval = () => {
      setTimeout(() => {
        spawnShootingStar();
        spawnInterval();
      }, globals.star_shooting_interval);
    };

    spawnInterval();

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      stars.forEach(star => star.resize(newWidth, newHeight));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(document.body);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i];
        if (!shootingStar.update()) {
          shootingStars.splice(i, 1);
        } else {
          shootingStar.draw();
        }
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'var(--background-gradient)',
      }}
    />
  );
};

export default StarryBackground; 