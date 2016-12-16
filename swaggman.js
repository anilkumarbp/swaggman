'use strict';
/**
  * SwaggMan
  *
  * Author: Benjamin M. Dean
  * Description: Simple tool to convert Swagger 2 Spec to Postman 2 Collection Spec
  * Created: December 2016
**/

// Dependencies
//const swaggerLoader = require('./lib/swaggerLoader');

class SwaggMan {

    constructor(options = {}) {
        this.swaggerSpec = options.swaggerSpec || process.env.SWAGGER_SPEC;
        //this.swaggerJSON = swaggerLoader.getSpecification(this.swaggerSpec);
    }

    convert (swaggerSpec){
        swaggerSpec = swaggerSpec || this.swwaggerSpec;
        if(!swaggerSpec) throw new Error('Swagger specification file or URI is required');
    }

}

module.exports = SwaggMan;
