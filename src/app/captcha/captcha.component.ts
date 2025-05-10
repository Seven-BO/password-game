import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-captcha',
  template: `
    <div class="captcha-wrapper">
      <div class="captcha-container">
        <span class="captcha-text">{{ captchaText }}</span>
      </div>
    </div>
  `,
  styles: [`
    .captcha-wrapper {
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .captcha-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    
    .captcha-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.05),
        rgba(0, 0, 0, 0.05) 10px,
        rgba(0, 0, 0, 0) 10px,
        rgba(0, 0, 0, 0) 20px
      );
    }
    
    .captcha-text {
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #333;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      transform: skewX(-5deg);
      position: relative;
      z-index: 1;
    }
  `]
})
export class CaptchaComponent {
  @Input() captchaText: string = '';
}