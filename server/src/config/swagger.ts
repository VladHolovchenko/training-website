// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Зубрів',
        version: '1.0.0',
        description: 'Документація API для Сайту про Зубрів',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/wisents': {
            // GET запит для отримання всіх зубрів
            get: {
                summary: 'Отримати всіх зубрів',
                responses: {
                    '200': {
                        description: 'Список всіх зубрів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Wisent' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового зубра
            post: {
                summary: 'Створити нового зубра',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Wisent' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт зубра",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Wisent' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного зубра за ID
        '/api/wisents/{id}': {
            // GET запит для отримання зубра за ID
            get: {
                summary: 'Отримати зубра за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зубра',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт зубра",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Wisent' },
                            },
                        },
                    },
                    '404': { description: 'Зубра не знайдено' },
                },
            },

            // PUT запит для повного оновлення зубра за ID
            put: {
                summary: 'Повністю оновити зубра',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зубра',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Wisent' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт зубра",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Wisent' },
                            },
                        },
                    },
                    '404': { description: 'Зубра не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення зубра за ID
            patch: {
                summary: 'Частково оновити зубра',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зубра',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Wisent' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт зубра",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Wisent' },
                            },
                        },
                    },
                    '404': { description: 'Зубра не знайдено' },
                },
            },
            // DELETE запит для видалення даних про зубра за ID
            delete: {
                summary: 'Видалити дані про зубра',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зубра',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Зубра не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Зубр
            Wisent: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'hornLength', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я зубра",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік зубра у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота зубра в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага зубра в кілограмах',
                    },
                    hornLength: {
                        type: 'number',
                        description: 'Довжина рогів в сантиметрах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать зубра',
                    },
                    description: {
                        type: 'string',
                        description: "Опис зубра (необов'язкове поле)",
                    },
                },
            },
        },
    },
};
