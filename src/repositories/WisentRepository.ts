import { injectable } from 'inversify';
import { Wisent, IWisent } from '../models/wisent';

// Клас-репозиторій для роботи з зубрами
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class WisentRepository {
    // Метод для отримання всіх зубрів з бази даних
    public async findAll(): Promise<IWisent[]> {
        return Wisent.find();
    }

    // Метод для пошуку зубра за унікальним ідентифікатором
    public async findById(id: string): Promise<IWisent | null> {
        return Wisent.findById(id);
    }

    // Метод для створення нового зубра в базі даних
    public async create(wisentData: IWisent): Promise<IWisent> {
        const wisent = new Wisent(wisentData);
        return wisent.save();
    }

    // Метод для видалення зубра за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Wisent.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про зубра (заміна всіх полів)
    public async update(id: string, wisentData: IWisent): Promise<IWisent | null> {
        return Wisent.findByIdAndUpdate(id, wisentData, { new: true });
    }

    // Метод для часткового оновлення даних про зубра (оновлення лише вказаних полів)
    public async patch(id: string, wisentData: Partial<IWisent>): Promise<IWisent | null> {
        return Wisent.findByIdAndUpdate(id, { $set: wisentData }, { new: true });
    }
}
