/**
 * Handler abstract class, designed to standardise CRUD and similar operations between the front-end and the database.
 * Each "Handler" should be created to handle one entity, such as "list", "user", "content".
*/

import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method'

export type HandlerFunc = {
    validate: ((...args: any) => any) | null,
    run: (...args: any) => any
}

export class Handler {
    
    #createMethod
    #readHandler
    #updateHandler
    #deleteHandler

    #objectName

    constructor(objectName: string) {
        this.#objectName = objectName;

    }

    get type() { return this.#objectName; }

    get create(){
        return this.#createMethod
    }


    addCreateHandler(createFuncDetails: HandlerFunc): Handler {
        this.#createMethod = new ValidatedMethod({
            name: `${this.#objectName}.create`,
            validate: createFuncDetails.validate,
            run: createFuncDetails.run
        })
        
        return this
    }
}

export default Handler;