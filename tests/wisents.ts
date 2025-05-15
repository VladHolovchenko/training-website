import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Wisent } from '../src/models/wisent';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про зубрів
describe('API вебдодатку сайту про зубрів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/wisents-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "wisents-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію зубрів
    beforeEach(async () => {
        await Wisent.deleteMany({});
    });

    // Тести для створення запису про нового зубра (POST-запит)
    describe('POST /api/wisents', () => {
        it('має створити запис про нового зубра', done => {
            // Тестові дані зубра
            const wisent = {
                name: 'Вухань',
                age: 3,
                height: 100,
                weight: 500,
                hornLength: 20,
                gender: 'male' as const,
                description: 'Сірий зубр',
            };

            // Виконуємо POST-запит для створення запису про зубра
            chai.request(app)
                .post('/api/wisents')
                .send(wisent)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', wisent.name);
                    expect(res.body).to.have.property('age', wisent.age);
                    expect(res.body).to.have.property('height', wisent.height);
                    expect(res.body).to.have.property('weight', wisent.weight);
                    expect(res.body).to.have.property('hornLength', wisent.hornLength);
                    expect(res.body).to.have.property('gender', wisent.gender);
                    expect(res.body).to.have.property('description', wisent.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів зубрів (GET-запит)
    describe('GET /api/wisents', () => {
        it('має отримати всіх зубрів', async () => {
            // Створюємо тестовий запис зубра
            const testWisent = new Wisent({
                name: 'Білан',
                age: 3,
                height: 90,
                weight: 320,
                hornLength: 10,
                gender: 'male',
                description: 'Білий зубр',
            });
            await testWisent.save();

            // Виконуємо GET-запит для отримання всіх записів зубрів
            const res = await chai.request(app).get('/api/wisents');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Білий зубр');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного зубра за ID (GET-запит)
    describe('GET /api/wisents/:id', () => {
        it('має отримати конкретного зубра за id', async () => {
            // Створюємо запис тестового зубра
            const testWisent = new Wisent({
                name: 'Косий',
                age: 6,
                height: 125,
                weight: 599,
                hornLength: 30,
                gender: 'male',
                description: 'Коричневий зубр',
            });
            const savedWisent = await testWisent.save();

            // Виконуємо GET-запит для отримання запису зубра за ID
            const res = await chai.request(app).get(`/api/wisents/${String(savedWisent._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 6);
            expect(res.body).to.have.property('height', 125);
            expect(res.body).to.have.property('weight', 599);
            expect(res.body).to.have.property('hornLength', 30);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий зубр');
        });

        it('має повернути 404 для неіснуючого зубра', async () => {
            // Виконуємо GET-запит для неіснуючого ID зубра
            const res = await chai.request(app).get('/api/wisents/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про зубра (PUT-запит)
    describe('PUT /api/wisents/:id', () => {
        it('має повністю оновити запис про зубра', async () => {
            // Створюємо тестового зубра
            const testWisent = new Wisent({
                name: 'Оригінальний',
                age: 7,
                height: 125,
                weight: 780,
                hornLength: 10,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedWisent = await testWisent.save();

            // Дані для оновлення зубра
            const updatedData = {
                name: 'Оновлений',
                age: 7,
                height: 130,
                weight: 650,
                hornLength: 20,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит для повного оновлення запису про зубра
            const res = await chai
                .request(app)
                .put(`/api/wisents/${String(savedWisent._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 7);
            expect(res.body).to.have.property('height', 130);
            expect(res.body).to.have.property('weight', 650);
            expect(res.body).to.have.property('hornLength', 20);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового зубра
            const testWisent = new Wisent({
                name: 'Оригінальний',
                age: 1,
                height: 110,
                weight: 500,
                hornLength: 15,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedWisent = await testWisent.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                hornLength: 15,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/wisents/${String(savedWisent._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що зубр не змінився
            const unchangedWisent = await Wisent.findById(savedWisent._id);
            expect(unchangedWisent).to.have.property('name', 'Оригінальний');
            expect(unchangedWisent).to.have.property('height', 110);
            expect(unchangedWisent).to.have.property('weight', 500);
            expect(unchangedWisent).to.have.property('hornLength', 15);
        });
    });

    // Тести для часткового оновлення запису про зубра (PATCH-запит)
    describe('PATCH /api/wisents/:id', () => {
        it('має частково оновити запис про зубра', async () => {
            // Створюємо тестового зубра
            const testWisent = new Wisent({
                name: 'Оригінальний',
                age: 6,
                height: 140,
                weight: 800,
                hornLength: 20,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedWisent = await testWisent.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/wisents/${String(savedWisent._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 140);
            expect(res.body).to.have.property('weight', 800);
            expect(res.body).to.have.property('hornLength', 20);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового зубра
            const testWisent = new Wisent({
                name: 'Оригінальний',
                age: 4,
                height: 120,
                weight: 600,
                hornLength: 10,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedWisent = await testWisent.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                hornLength: 10,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/wisents/${String(savedWisent._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 120);
            expect(res.body).to.have.property('weight', 600);
            expect(res.body).to.have.property('hornLength', 10);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/wisents', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/wisents')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису зубра (DELETE-запит)
    describe('DELETE /api/wisents/:id', () => {
        it('має видалити запис про зубра', async () => {
            // Створюємо тестового зубра
            const testWisent = new Wisent({
                name: 'Стрибунець',
                age: 4,
                height: 100,
                weight: 700,
                hornLength: 10,
                gender: 'female',
                description: 'Чорний зубр',
            });
            const savedWisent = await testWisent.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/wisents/${String(savedWisent._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про зубра видалено');

            // Перевіряємо, що запис про зубра дійсно видалено з бази
            const findWisent = await Wisent.findById(savedWisent._id);
            expect(findWisent).to.be.null;
        });
    });
});
