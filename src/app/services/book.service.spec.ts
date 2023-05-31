import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BookService } from "./book.service"
import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Book } from "../models/book.model";
import { environment } from "../../environments/environment";
import { of } from "rxjs";
import swal from 'sweetalert2';

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
        price: 30,
        amount: 2
    }
]
const book:Book = {
    name: "Mistborn",
    author: "Sanderson",
    isbn: "12345A",
    amount:1,
    price:12
}
const mock = ()=>{
    let storage : {[key:string]:string}= {}
    return {
        getItem: (key:string)=>(key in storage ? storage[key]:null),
        setItem: (key:string, value:string) =>(storage[key] = value || ""),
        clear:()=>(storage = {})
    }
}

Object.defineProperty(window, "localStorage", {value:mock()});
Object.defineProperty(window, "session", {value:mock()});

describe("Book Service",()=>{

    let service: BookService;
    let httpMock :HttpTestingController;
    let httpClientMock:HttpClientTestingModule;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[
                HttpClientTestingModule
            ],
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents()
    })
    beforeEach(()=>{
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController)
        httpClientMock = TestBed.inject(HttpClientTestingModule);
    })
    //Resetea todos los mocks para el local storage y tal
    afterEach(()=>{
        jest.resetAllMocks();
    })
    //Utilizar en servicios que realizan llamadas a la API
    afterEach(()=>{
        //No se lanza el siguiente test mientras haya una peticion pendiente
        httpMock.verify();
    })
    it("Should create",()=>{
        expect(service).toBeTruthy();
    })
    it("getBooks return a list of books ", ()=>{
        //Nos suscribimos a getBooks porque devuelve un observable
        service.getBooks().subscribe((res:Book[])=>{
            expect(res).toEqual(listBook)
        })
        //Expect that a single request has been made which matches the given URL, and return its mock.
        const req = httpMock.expectOne(environment.API_REST_URL + `/book`);
        //Esperamos que la petición sea de timpo GET
        expect(req.request.method).toBe("GET");
        
        //La petición req envía un observable de la lista de libros
        req.flush(listBook)
    })
    xit("getBooks return a list of books Nacho version", ()=>{
        const URL_MOCK= environment.API_REST_URL + `/book`;
        const spy = jest.spyOn(service,'getBooks').mockReturnValue(of(listBook));
        
        service.getBooks();
        expect(spy).toHaveBeenCalledWith(URL_MOCK);

        service.getBooks().subscribe((data)=>{
            expect(data).toEqual(listBook)
        })
    })
    // public getBooks(): Observable<Book[]> {
    //     const url: string = environment.API_REST_URL + `/book`;
    //     return this._httpClient.get<Book[]>(url);
    //   }

    //Testing en sobre localStorage
    it("getBooksFromCart return an empty array when localStorage is empty", ()=>{
        const  listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0)
    })
    it("getBooksFromCart return an array when exist in localStorage", ()=>{
        localStorage.setItem("listCartBook", JSON.stringify(listBook));
        const newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(3)
    })
    it("addBookToCart adds correctly when the list is empty",()=>{
        localStorage.clear();
        const toastMock={
            fire: ()=> null
        } as any;

        const spy1= jest.spyOn(swal,"mixin").mockImplementation(()=>{
            return toastMock;
        });
        
        let newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(0);
        service.addBookToCart(book);
        newListBook= service.getBooksFromCart();
        expect(newListBook.length).toBe(1);

        expect(spy1).toHaveBeenCalled();
    })
    xit("addBookToCart adds correctly the book",()=>{
        const book:Book = listBook[0];
        let amount = book.amount;
        service.addBookToCart(book);
        const newListBook= service.getBooksFromCart();
        expect(newListBook[0].amount).toBeGreaterThan(amount);
    })

    it("removeBooksFromCart remove all the books",()=>{
        localStorage.setItem("listCartBook", JSON.stringify(listBook));
        service.removeBooksFromCart();
        const items = localStorage.getItem("listCartBook");
        expect(items).toBeFalsy();
    })
})

// public removeBooksFromCart(): void {
//     localStorage.setItem('listCartBook', null);
//   }