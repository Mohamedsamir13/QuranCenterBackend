class User {
  constructor({ id, name, email, type, createdAt ,password}) {
    this.id = id;
    this.name = name;
    this.email = email;
        this.password = password; // 🔹 تأكد إن ده موجود

    this.type = type; // 'Parent' | 'Teacher' | 'Manager' | 'Student'
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = User;
