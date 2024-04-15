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
    
    // These get read by Meteor during execution, so we don't care that they are not "used" by anything from a linting perspective
    #createMethod
    #readMethod
    #updateMethod
    #deleteMethod

    #objectName

    constructor(objectName: string) {
        this.#objectName = objectName;
    }

    get type() { return this.#objectName; }

    addCreateHandler(funcDetails: HandlerFunc): Handler {
        this.#createMethod = new ValidatedMethod({
            name: `${this.#objectName}.create`,
            validate: funcDetails.validate,
            run: funcDetails.run
        });
        
        return this;
    }

    addReadHandler(funcDetails: HandlerFunc): Handler {
        this.#readMethod = new ValidatedMethod({
            name: `${this.#objectName}.read`,
            validate: funcDetails.validate,
            run: funcDetails.run
        });

        return this;
    }

    addUpdateHandler(funcDetails: HandlerFunc): Handler {
        this.#updateMethod = new ValidatedMethod({
            name: `${this.#objectName}.update`,
            validate: funcDetails.validate,
            run: funcDetails.run
        });

        return this;
    }

    addDeleteHandler(funcDetails: HandlerFunc): Handler {
        this.#deleteMethod = new ValidatedMethod({
            name: `${this.#objectName}.delete`,
            validate: funcDetails.validate,
            run: funcDetails.run
        });

        return this;
    }

}

export default Handler;