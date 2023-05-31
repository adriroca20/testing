import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavComponent } from "./nav.component"
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing"
import { HomeComponent } from "../pages/home/home.component";
import { CartComponent } from "../pages/cart/cart.component";
import { Router } from "@angular/router";

class ComponentTestRoute{

}

describe("Nav component", ()=>{
    let component: NavComponent;
    let fixture : ComponentFixture<NavComponent>;
    
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[
                RouterTestingModule.withRoutes([
                    //Se le añade el ComponentTestRoute porque asi no hay que configurar el componente real
                    //No hace falta usar el testBed
                    // {path:"cart", component: CartComponent}
                    {path:"cart", component: ComponentTestRoute},
                    {path:"home", component: ComponentTestRoute}
                ])
            ],
            declarations:[
                NavComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    })
    beforeEach(()=>{
        fixture = TestBed.createComponent(NavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })
    it("Should be created", ()=>{
        expect(component).toBeTruthy();
    })
    it("Should navigate", ()=>{
        const router = TestBed.inject(Router);
        const spy = jest.spyOn(router, "navigate");

        component.navTo("home");
        expect(spy).toHaveBeenCalledWith(["/home"]);
        
        component.navTo("cart");
        expect(spy).toHaveBeenCalledWith(["/cart"]);
    })
})