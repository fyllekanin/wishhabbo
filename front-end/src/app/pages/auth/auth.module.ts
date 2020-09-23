import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { authRoutes } from './auth.routes';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes),
        CommonModule,
        ContentModule,
        FormsModule
    ],
    declarations: [
        LoginComponent
    ],
    exports: [
        RouterModule
    ]
})
export class AuthModule {
}
