const DeleteUserAdminUseCase = require('../../../../../src/app/use-case/user/admin/delete/delete-user-admin');
const UserRepositorySpy = require('../../../../mocks/user-repository');
const ValidateUserServiceSpy = require('../../../../mocks/validate-user-service');
const OutputBoundary = require('../../../../../src/app/use-case/user/admin/delete/output-boundary');
const { ValidationError } = require('../../../../../src/shared/utils/errors');

const makeUserAdminSpyData = () => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any-email',
  password: 'password',
  roleId: '8609e912-c66b-4a21-8a38-d2ee0f881d11',
})

const makeSut = () => {
  const userRepositorySpy = new UserRepositorySpy();
  const validateUserServiceSpy = new ValidateUserServiceSpy({
    userRepository: userRepositorySpy
  });
  const userAdmin = makeUserAdminSpyData();

  const sut = new DeleteUserAdminUseCase({
    userRepository: userRepositorySpy,
    validateUserService: validateUserServiceSpy
  });

  return {
    sut,
    userAdmin,
    userRepositorySpy,

  }
}

const mockReturnUserAdminRepository = (userRepositorySpy, userAdmin) => {
  const mockReturn = {
    ...userAdmin,
    createdAt: 'any-createdAt',
    updatedAt: 'any-updatedAt',
    deletedAt: 'any-date',
  };
  userRepositorySpy.fetchOne.mockReturnValue(mockReturn);
  userRepositorySpy.delete.mockReturnValue(mockReturn);
  return mockReturn;
}

describe("use-case: delete user admin", () => {

  test("Should return user deleted", async () => {
    const { sut, userAdmin, userRepositorySpy } = makeSut();
    const returnMocks = mockReturnUserAdminRepository(userRepositorySpy, userAdmin);
    const userAdminUpdated = await sut.handle(userAdmin);
    const expected = {
      id: returnMocks.id,
      name: returnMocks.name,
      email: returnMocks.email,
      deletedAt: returnMocks.deletedAt,
    };

    expect(userAdminUpdated).toEqual(expected);
  });

  test("Should return instanceof OutputBoundary", async () => {
    const { sut, userAdmin, userRepositorySpy } = makeSut();
    mockReturnUserAdminRepository(userRepositorySpy, userAdmin);
    const userAdminUpdated = await sut.handle(userAdmin);

    expect(userAdminUpdated).toBeInstanceOf(OutputBoundary);
  });

  test("Should validate deletedAt is not null", async () => {
    const { sut, userAdmin, userRepositorySpy } = makeSut();
    const returnMocks = mockReturnUserAdminRepository(userRepositorySpy, userAdmin);
    const userAdminUpdated = await sut.handle(userAdmin);

    expect(userAdminUpdated).not.toBeNull();
  });

  test("Should call handle", async () => {
    const { sut, userAdmin, userRepositorySpy } = makeSut();

    jest.spyOn(sut, sut.handle.name);
    mockReturnUserAdminRepository(userRepositorySpy, userAdmin);

    await sut.handle(userAdmin);

    expect(sut.handle).toHaveBeenCalled();
    expect(sut.handle).toHaveBeenCalledTimes(1);
    expect(sut.handle).toHaveBeenCalledWith(userAdmin);
  });

  // test("Should call delete", async () => {
  //   const { sut, userAdmin, userRepositorySpy } = makeSut();
  //   const expected = mockReturnUserAdminRepository(userRepositorySpy, userAdmin);

  //   await sut.handle(userAdmin);

  //   expect(userRepositorySpy.delete).toHaveBeenCalled();
  //   expect(userRepositorySpy.delete).toHaveBeenCalledTimes(1);
  //   expect(userRepositorySpy.delete).toHaveBeenCalledWith(expected);
  // });

  // test("Should call fetchOne", async () => {
  //   const { sut, userAdmin, userRepositorySpy } = makeSut();
  //   mockReturnUserAdminRepository(userRepositorySpy, userAdmin);

  //   await sut.handle(userAdmin);

  //   expect(userRepositorySpy.fetchOne).toHaveBeenCalled();
  //   expect(userRepositorySpy.fetchOne).toHaveBeenCalledTimes(1);
  //   expect(userRepositorySpy.fetchOne).toHaveBeenCalledWith({ id: userAdmin.id });
  // });

  test("Should call handle without parameter", async () => {
    const { sut } = makeSut();

    await expect(sut.handle()).rejects.toThrow();
    await expect(sut.handle()).rejects.toThrow(TypeError);
    await expect(sut.handle()).rejects.toThrow("Cannot read property 'id' of undefined");
  });

  test("Should instantiate a use-case without a repository", async () => {
    const sut = new DeleteUserAdminUseCase();

    await expect(sut.handle()).rejects.toThrow();
    await expect(sut.handle()).rejects.toThrow(TypeError);
    await expect(sut.handle()).rejects.toThrow("Cannot read property 'id' of undefined");
  });

  // test("Should validate user admin", async () => {
  //   const { sut, userAdmin, userRepositorySpy } = makeSut();
  //   const userNotAdmin = { ...userAdmin, roleId: 'roleId-common' };

  //   mockReturnUserAdminRepository(userRepositorySpy, userNotAdmin);

  //   await expect(sut.handle(userNotAdmin)).rejects.toThrow();
  //   await expect(sut.handle(userNotAdmin)).rejects.toThrow(ValidationError);
  //   await expect(sut.handle(userNotAdmin)).rejects.toThrow("Usuario não é admin");
  // });

});
