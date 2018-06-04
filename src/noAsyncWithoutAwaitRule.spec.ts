import {helper} from './lintRunner';

const rule = 'no-async-without-await';

describe('noAsyncWithoutAwait Rule', () => {
    describe('Functions', () => {
        it(`should fail when the async function doesn't have an await`, () => {
            const src = `
            async function a(){
               let b = 1;
               console.log(b);
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
            expect(result.failures[0].getFailure()).toBe('Async function without await is not allowed');
        });

        it('should not fail when the async function has an await', () => {
            const src = `
            async function a(){
               let b = 1;
               await console.log(b);
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(0);
        });

        it('should not fail when the async function has an await inside a function call', () => {
            const src = `
            async function a(){
               let b = 1;
               console.log(await b());
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(0);
        });

        it('should fail when the async function has an await inside a arrow function declaration', () => {
            const src = `
            async function a(){
               let b = 1;
               let b = async () => {
                    await fetch();               
               };
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
        });

        it('should fail when the async function has an await inside a regular function declaration', () => {
            const src = `
            async function a(){
               let b = 1;
               async function f() {
                    await fetch();               
               };
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
        });

        it('should fail when the function is not at the top level', () => {
            const src = `
            function a(){
               let b = 1;
               async function f() {
                    fetch();               
               };
               
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
        });
    });

    describe('Arrow functions', () => {
        it(`should fail when the async arrow function doesn't have an await`, () => {
            const src = `
            const a = async () => {
               let b = 1;
               console.log(b);
            }
            `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
            expect(result.failures[0].getFailure()).toBe('Async function without await is not allowed');
        });
    });

    describe('Classes', () => {
        it('should fail when async class method has no await', () => {
            const src = `
            class A {
                async b() {
                    console.log(1);
                }
            
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
        });

        it('should not fail when async class method has await', () => {
            const src = `
            class A {
                async b() {
                    await b();
                }
            
            }
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(0);
        });

        it('should check classes that are inside functions', () => {
            const src = `
          async () => {
            await a();
            class A {
                async b() {
                    console.log(1);
                }
            
            }
          };
        `;
            const result = helper({src, rule});
            expect(result.errorCount).toBe(1);
        });
    });
});
