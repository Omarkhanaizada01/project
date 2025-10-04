
import axios, { AxiosError } from "axios";

const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK as string; 

// Создание контакта
export async function createContact(name: string, email: string) {
  try {
    const response = await axios.post(`${BITRIX_WEBHOOK}/crm.contact.add`, {
      fields: {
        NAME: name,
        EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
      },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Ошибка при создании контакта:", err.response?.data || err.message);
    throw err;
  }
}

// Получение списка контактов
export async function getContacts() {
  try {
    const response = await axios.get(`${BITRIX_WEBHOOK}/crm.contact.list`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Ошибка при получении контактов:", err.response?.data || err.message);
    throw err;
  }
}
