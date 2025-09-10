import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeModule } from "./home/home.module";
import { RouterLink  } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loaderInterceptor } from './core/Interceptor/loader.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { credentialsInterceptor } from './core/Interceptor/credentials.interceptor';
import { AboutComponent } from './about/about.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { RatingComponent } from './rating/rating.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BestSellersComponent,
    FavoriteComponent,
    RatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    RouterLink,
    NgxSpinnerModule,
    FormsModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-right',
      countDuplicates: true,
      timeOut:1500,
      progressBar:true,
    }),
    
    
    
    
],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide:HTTP_INTERCEPTORS,useClass:credentialsInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:loaderInterceptor,multi:true},
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
