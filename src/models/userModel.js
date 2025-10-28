class User {
  constructor({ id, name, email, type, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.type = type; // 'Parent' | 'Teacher' | 'Manager' | 'Student'
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = User;
