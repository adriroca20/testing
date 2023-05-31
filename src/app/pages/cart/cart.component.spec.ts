import { CartComponent } from "./cart.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "src/app/models/book.model";
import { By } from "@angular/platform-browser";


const listBook: Book[] = [
    {
        name: "",
        author: "",
        isbn: "",
        price: 10,
        amount: 2
    },
    {
        name: "",
        author: "",
        isbn: "",
        price: 30,
        amount: 2
    },
    {
        name: "",
        author: "",
        isbn: "",
        price: 7,
        amount: 5
    }
]
describe("Cart component", () => {
    let component: CartComponent;
    // Extrae datos del componente
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                //Es importante usar el testing module para que no se realicen llamadas a la API reales
                HttpClientTestingModule,
            ],
            declarations: [
                CartComponent
            ],
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    })

    // Ejecuta el código antes de cada test
    beforeEach(() => {
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(BookService);
        // Creea un mock para getBooksFromCart el cual devuelve listBook
        jest.spyOn(service, "getBooksFromCart").mockImplementation(() => listBook);
    })
    // Ejecuta el código después de cada test
    afterEach(()=>{
        //Se desuscribe de los observables
        fixture.destroy();
        //Resetea todos los mocks
        jest.resetAllMocks();
    })

    // Comprobar que se crea el componente
    it("Should create", () => {
        expect(component).toBeTruthy();
    })

    // Comprobar método con return 
    it("getTotalPrice returns an amount", () => {
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThan(0);
    })

    // Comprobar método con return void
    it("onInputNumberChange increments correctly", () => {
        const action = "plus";
        const book = listBook[0];
        // Mira el método updateAmountBook y ejecuta la función del mock
        //En este caso solo devuelve nulo porque no queremos que hagan nada fuera de nuestra clase
        const spy1 = jest.spyOn(service, "updateAmountBook").mockImplementation(() => null)
        const spy2 = jest.spyOn(component, "getTotalPrice").mockImplementation(() => null);

        component.onInputNumberChange(action, book);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    })
    it("onInputNumberChange decrements correctly", () => {
        const action = "minus";
        const book = listBook[1];
        const spy1 = jest.spyOn(service, "updateAmountBook").mockImplementation(() => null)
        const spy2 = jest.spyOn(component, "getTotalPrice").mockImplementation(() => null);

        expect(book.amount).toBe(2)
        component.onInputNumberChange(action, book);
        expect(book.amount).toBe(1)
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    })
    // Un método privado siempre se prueba desde el método publico que le llama
    it("onClearBooks clears cart", ()=>{
        component.listCartBook= listBook;
        const spy1 = jest.spyOn(service, "removeBooksFromCart").mockImplementation(() => null)
        const spy2 = jest.spyOn(component as any, "_clearListCartBook")
        component.onClearBooks()

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(component.listCartBook.length).toBe(0);
    });

    //Pruebas de integración
    it('The title "The cart is empty" is not displayed when there is a list', ()=>{
        component.listCartBook = listBook;
        //Se añade la lista y después actualiza la presentación
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css("#titleCartEmpty"));
        expect(debugElement).toBeFalsy();
    })
    it('The title "The cart is empty" is displayed when the list is empty', ()=>{
        component.listCartBook = [];
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css("#titleCartEmpty"));
        expect(debugElement).toBeTruthy();

        //Comprueba si el texto es el esperado
        if(debugElement){
            const element:HTMLElement = debugElement.nativeElement;
            expect(element.innerHTML).toContain("The cart is empty");
        }
    })
})

