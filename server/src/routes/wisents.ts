import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { WisentRepository } from '../repositories/WisentsRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію зубрів з контейнера інверсії залежностей
const wisentRepository = container.get(WisentRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів зубрів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи зубрів з бази даних через репозиторій
        const wisents = await wisentRepository.findAll();
        res.json(wisents);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного зубра за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук зубра за ідентифікатором
        const wisent = await wisentRepository.findById(req.params.id);
        if (wisent) {
            res.json(wisent);
        } else {
            // Якщо зубр не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зубра не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису зубра
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис зубра з даних запиту
        const newWisent = await wisentRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного зубра
        res.status(201).json(newWisent);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису зубра
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'hornLength', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо зубра з вказаним ID
        const wisent = await wisentRepository.update(req.params.id, req.body);
        if (wisent) {
            return res.json(wisent);
        } else {
            // Якщо зубр не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис зубра не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису зубра
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису зубра - передаються лише ті поля, які потрібно змінити
        const wisent = await wisentRepository.patch(req.params.id, req.body);
        if (wisent) {
            res.json(wisent);
        } else {
            // Якщо зубр не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зубра не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису зубра
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про зубра за ID
        const wisent = await wisentRepository.delete(req.params.id);
        if (wisent) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про зубра видалено' });
        } else {
            // Якщо зубр не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про зубра не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
