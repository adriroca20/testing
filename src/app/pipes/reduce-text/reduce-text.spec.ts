import { ReduceTextPipe } from "./reduce-text.pipe";

describe("Reduce text pipe", ()=>{
    let pipe:ReduceTextPipe;

    beforeEach(()=>{
        pipe = new ReduceTextPipe();
    });
    it("Should create", ()=>{
        expect(pipe).toBeTruthy();
    });
});