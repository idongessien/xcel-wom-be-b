const db = require('../../data/db-config');
const Companies = require('../company/companyModel');

const getCompany = async (id) => {
  return await db('companies').select().where('id', '=', id);
};
const getCompanyUsers = async (id) => {
  return await db('profiles').select().where('company', '=', id);
};

const getCompanyUser = async (company_id, user_id) => {
  return await db('profiles').select().where('id', '=', user_id);
};

const createUser = async (user) => {
  return await db('profiles').insert(user);
};

const createUserWithCode = async (user, code) => {
  const role = await Companies.findRoleByCode(code);
  if (role) {
    user.role = role.id;
    user.company = role.company;
    return createUser(user);
  } else {
    return undefined;
  }
};

const createUserNewCompany = async (user, company) => {
  const createdCompany = await Companies.create(company);
  user.company = createdCompany.id;
  const roles = await Companies.findCompanyRoles(createdCompany.id);
  const role = roles.find((r) => r.name === 'Admin');
  user.role = role.id;
  return createUser(user);
};

const updateProfile = async (updates, userId) => {
  return await db('profiles').where('id', '=', userId).update(updates);
};

const deleteUser = async (id) => {
  return await db('profiles').where('id', '=', id).del();
};

module.exports = {
  getCompany,
  getCompanyUsers,
  getCompanyUser,
  createUser,
  createUserWithCode,
  createUserNewCompany,
  updateProfile,
  deleteUser,
};
