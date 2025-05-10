import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Rule {
  id: number;
  description: string;
  validator: (password: string) => boolean;
  visible: boolean;
  completed: boolean;
}

@Component({
  selector: 'app-password-game',
  templateUrl: './password-game.component.html',
  styleUrls: ['./password-game.component.scss']
})
export class PasswordGameComponent implements OnInit {
  passwordControl = new FormControl('', [Validators.required]);
  rules: Rule[] = [];
  captchaValue: string = '';
  sponsors: string[] = ['Coca-Cola', 'Microsoft', 'Apple', 'Google', 'Amazon'];
  currentSponsor: string = '';
  
  activeRules: number = 1;
  gameCompleted: boolean = false;
  
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initRules();
    
    this.generateRandomElements();
    
    this.passwordControl.valueChanges.subscribe(value => {
      if (value) {
        this.validateRules(value);
      }
    });
  }

  initRules(): void {
    this.rules = [
      {
        id: 1,
        description: 'Tu contraseña debe tener al menos 5 caracteres.',
        validator: (password: string) => password.length >= 5,
        visible: true,
        completed: false
      },
      {
        id: 2,
        description: 'Tu contraseña debe incluir un número.',
        validator: (password: string) => /\d/.test(password),
        visible: false,
        completed: false
      },
      {
        id: 3,
        description: 'Tu contraseña debe incluir una letra mayúscula.',
        validator: (password: string) => /[A-Z]/.test(password),
        visible: false,
        completed: false
      },
      {
        id: 4,
        description: 'Tu contraseña debe incluir un carácter especial.',
        validator: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        visible: false,
        completed: false
      },
      {
        id: 5,
        description: 'Los dígitos de tu contraseña deben sumar 25.',
        validator: (password: string) => {
          const digits = password.match(/\d/g);
          if (!digits) return false;
          return digits.reduce((sum, digit) => sum + parseInt(digit), 0) === 25;
        },
        visible: false,
        completed: false
      },
      {
        id: 6,
        description: 'Tu contraseña debe incluir un mes del año.',
        validator: (password: string) => {
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];
          return months.some(month => 
            password.toLowerCase().includes(month.toLowerCase())
          );
        },
        visible: false,
        completed: false
      },
      {
        id: 7,
        description: 'Tu contraseña debe incluir un número romano.',
        validator: (password: string) => /[IVXLCDM]+/.test(password),
        visible: false,
        completed: false
      },
      {
        id: 8,
        description: `Tu contraseña debe incluir uno de nuestros patrocinadores: ${this.currentSponsor}`,
        validator: (password: string) => 
          password.toLowerCase().includes(this.currentSponsor.toLowerCase()),
        visible: false,
        completed: false
      },
      {
        id: 9,
        description: 'Los números romanos en tu contraseña deben multiplicarse para dar 35.',
        validator: (password: string) => {
          const romanNumerals = this.findRomanNumerals(password);
          if (romanNumerals.length === 0) return false;
          
          const product = romanNumerals.reduce((product, numeral) => 
            product * this.convertRomanToDecimal(numeral), 1);
          
          return product === 35;
        },
        visible: false,
        completed: false
      },
      {
        id: 10,
        description: `Tu contraseña debe incluir este CAPTCHA: ${this.captchaValue}`,
        validator: (password: string) => 
          password.includes(this.captchaValue),
        visible: false,
        completed: false
      }
    ];
  }

  validateRules(password: string): void {
    let allVisibleRulesCompleted = true;
    
    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i].visible) {
        const wasCompleted = this.rules[i].completed;
        this.rules[i].completed = this.rules[i].validator(password);
        
        if (!this.rules[i].completed) {
          allVisibleRulesCompleted = false;
        } else if (!wasCompleted && this.rules[i].completed) {
          this.showSuccessMessage(`¡Regla ${i + 1} completada!`);
          
          if (i < this.rules.length - 1 && !this.rules[i + 1].visible) {
            this.revealNextRule();
          }
        }
      }
    }
    
    if (allVisibleRulesCompleted && this.activeRules === this.rules.length) {
      this.completeGame();
    }
  }

  revealNextRule(): void {
    if (this.activeRules < this.rules.length) {
      this.rules[this.activeRules].visible = true;
      this.activeRules++;
    }
  }

  completeGame(): void {
    if (!this.gameCompleted) {
      this.gameCompleted = true;
      this.showSuccessMessage('¡Felicitaciones! Has completado el Password Game');
    }
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  resetGame(): void {
    this.passwordControl.setValue('');
    this.gameCompleted = false;
    this.activeRules = 1;
    this.generateRandomElements();
    
    this.rules.forEach((rule, index) => {
      rule.completed = false;
      rule.visible = index === 0;
    });
  }

  generateRandomElements(): void {
    this.captchaValue = this.generateRandomCaptcha();
    
    this.currentSponsor = this.sponsors[Math.floor(Math.random() * this.sponsors.length)];
    
    if (this.rules.length > 7) {
      this.rules[7].description = `Tu contraseña debe incluir uno de nuestros patrocinadores: ${this.currentSponsor}`;
    }
    if (this.rules.length > 9) {
      this.rules[9].description = `Tu contraseña debe incluir este CAPTCHA: ${this.captchaValue}`;
    }
  }
  
  generateRandomCaptcha(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  findRomanNumerals(text: string): string[] {
    const romanRegex = /[IVXLCDM]+/g;
    return text.match(romanRegex) || [];
  }
  
  convertRomanToDecimal(roman: string): number {
    const values: {[key: string]: number} = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    
    let result = 0;
    
    for (let i = 0; i < roman.length; i++) {
      const current = values[roman[i]];
      const next = i + 1 < roman.length ? values[roman[i + 1]] : 0;
      
      if (current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    
    return result;
  }
  
  getCompletedRules(): number {
    return this.rules.filter(rule => rule.completed).length;
  }
  
  getVisibleRules(): number {
    return this.rules.filter(rule => rule.visible).length;
  }
  
  getProgressPercentage(): number {
    const completed = this.getCompletedRules();
    const total = this.rules.length;
    return (completed / total) * 100;
  }
}