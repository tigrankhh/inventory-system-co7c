export interface InventoryItem {
  id: string          // Уникальный ID (обычно длинная строка типа uuid)
  user_id: string     // ID владельца (чтобы один юзер не видел вещи другого)
  name: string        // Название (например, "iPhone 15")
  category: string    // Категория (например, "Electronics")
  quantity: number    // Количество (число, например, 15)
  
  // А тут «выбор из списка»: статус может быть ТОЛЬКО одним из трех вариантов
  status: 'in stock' | 'low' | 'out' 
  
  created_at: string  // Дата создания (строка в формате ISO)
}
