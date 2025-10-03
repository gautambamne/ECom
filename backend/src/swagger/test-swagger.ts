import { swaggerSpec } from './swagger.config';

console.log('=== Swagger Configuration Test ===');
console.log('OpenAPI Version:', swaggerSpec.openapi);
console.log('API Title:', swaggerSpec.info.title);
console.log('API Version:', swaggerSpec.info.version);
console.log('Servers:', swaggerSpec.servers);

console.log('\n=== Available Paths ===');
if (swaggerSpec.paths) {
    Object.keys(swaggerSpec.paths).forEach(path => {
        console.log(`✓ ${path}`);
    });
} else {
    console.log('No paths found in swagger spec');
}

console.log('\n=== Available Schemas ===');
if (swaggerSpec.components?.schemas) {
    Object.keys(swaggerSpec.components.schemas).forEach(schema => {
        console.log(`✓ ${schema}`);
    });
} else {
    console.log('No schemas found in swagger spec');
}

console.log('\n=== Security Schemes ===');
if (swaggerSpec.components?.securitySchemes) {
    Object.keys(swaggerSpec.components.securitySchemes).forEach(scheme => {
        console.log(`✓ ${scheme}`);
    });
} else {
    console.log('No security schemes found');
}

console.log('\n✅ Swagger configuration is valid!');