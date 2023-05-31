import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component"
import { BookService } from "../../services/book.service";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";
import { Book } from "src/app/models/book.model";


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

const bookServiceMock = {
    getBooks: ()=> of(listBook)
}

//Crea un pipe fake
@Pipe({name:"reduceText"})
class ReducePipeMock implements PipeTransform{
    transform():string{
        return ""
    }
}

describe("Home component", ()=>{
    let component: HomeComponent;
    let fixture:ComponentFixture<HomeComponent>;
    let service:BookService;
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                HomeComponent,
                //Metemos el pipe en las declarations
                ReducePipeMock
            ],
            providers: [
                // BookService
                //En vez de usar un mock para cada vez que se use el servicio, creas un servicio mock
                //con un objeto que tiene los "metodos" del servicio original
                {
                    provide:BookService,
                    useValue: bookServiceMock
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    })
    beforeEach(()=>{
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = fixture.debugElement.injector.get(BookService);
    })
    it("Should create", ()=>{
        expect(component).toBeTruthy();
    })

    //Este test comprueba el funcionamiento del subscribe y 
    //que el valor que devuelve es un observable de tipo book
    it("getBook get books from the subscription", ()=>{
        // const spy1= jest.spyOn(service, "getBooks").mockReturnValueOnce(of(listBook));
        component.getBooks();
        // expect(spy1).toHaveBeenCalled();
        expect(component.listBook.length).toBe(3);
        expect(component.listBook).toEqual(listBook);
    })
})