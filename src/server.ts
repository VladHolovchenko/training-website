import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { container } from './config/container';
import { TYPES } from './types/types';
import { IDatabase } from './interfaces/IDatabase';
import * as config from './config/env';
import type { IConfig } from './config/container';
import { swaggerSpec } from './config/swagger';

// Створюємо екземпляр Express-додатку
const app = express();

// Підключаємо проміжне програмне забезпечення (middleware)
app.use(cors()); // Дозволяє крос-доменні запити
app.use(bodyParser.json()); // Парсинг JSON в тілі запиту

// Налаштування документації Swagger
// Надаємо доступ до JSON-специфікації REST API
app.get('/api-spec.json', (_req, res) => {
    res.json(swaggerSpec);
});
// Налаштовуємо інтерфейс Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Отримуємо екземпляр бази даних з IoC контейнера за допомогою бібліотеки Inversify
const database = container.get<IDatabase>(TYPES.IDatabase);
const appConfig = container.get<IConfig>('Config');

// Підключаємо обробники HTTP-запитів до REST API
import wisentRoutes from './routes/wisents';
app.use('/api/wisents', wisentRoutes);

// Отримуємо порт з конфігурації
const PORT = config.PORT;

// Запускаємо сервер лише якщо файл запущено напряму, а не як модуль
if (require.main === module) {
    // Підключаємося до бази даних перед запуском сервера
    database
        .connect()
        .then(() => {
            // Запускаємо HTTP-сервер
            app.listen(PORT, () => {
                console.log(`Сервер запущено на порту ${PORT} у режимі ${appConfig.nodeEnv}`);

                // Створюємо базову URL-адресу залежно від середовища
                const baseUrl =
                    process.env.CODESPACE_NAME !== undefined
                        ? `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`
                        : `http://localhost:${PORT}`;

                console.log(`Документація API доступна за адресою ${baseUrl}/api-docs`);
                console.log(
                    `Специфікація доступна в Swagger UI за адресою ${baseUrl}/api-spec.json`,
                );
            });
        })
        .catch(err => {
            // Обробка помилок підключення до бази даних
            console.error('Не вдалося підключитися до бази даних:', err);
            process.exit(1);
        });
}

export default app;
