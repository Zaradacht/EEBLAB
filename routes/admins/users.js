const router = require("express").Router();
/**
 * THIS ROUTER IS RESPONSIBLE FOR CREATING A USER, ADMIN ONLY CAN DO THAT
 */

//middleware
const middleware = require("../../middleware/index");
// controller
const adminUsersController = require("../../controllers/adminUsersController");
// validation
const adminValidation = require("../../middleware/adminValidation");

// @route   GET admins/users/
// @desc    Show users page
// @access  Private
router.get("/", middleware.isAdmin, adminUsersController.showUsers);

// @route   GET admins/users/requests
// @desc    Show users requests page
// @access  Private
router.get(
  "/requests",
  middleware.isAdmin,
  adminUsersController.showUsersRequests
);

// @route   GET admins/users/requests/:id/approve
// @desc    Show users requests page
// @access  Private
router.get(
  "/requests/:id/approve",
  middleware.isAdmin,
  adminUsersController.approveUserRequest
);

// @route   GET admins/users/requests/:id/delete
// @desc    Show users requests page
// @access  Private
router.get(
  "/requests/:id/delete",
  middleware.isAdmin,
  adminUsersController.deleteUserRequest
);

// @route   GET admins/users/new
// @desc    Show users register page
// @access  Private
router.get("/new", middleware.isAdmin, adminUsersController.newUserForm);

// @route   GET admins/users/:id
// @desc    edit a user page /// NOT OBLIGATORY.
// @access  Private
router.get("/:id", middleware.isAdmin, adminUsersController.showSpecificUser);

// @route   GET admins/users/:id/edit
// @desc    Show users edit page
// @access  Private
router.get(
  "/:id/edit",
  middleware.isAdmin,
  adminUsersController.editSpecificUser
);

// @route   POST admins/users/
// @desc    Create a new user
// @access  Private
router.post(
  "/",
  middleware.isAdmin,
  adminValidation.validateUserRegister,
  adminUsersController.createNewUser
);

// @route   PUT admins/users/:id
// @desc    Update an existing user
// @access  Private
router.put(
  "/:id",
  middleware.isAdmin,
  adminValidation.validateUserUpdate,
  adminUsersController.updateSpecificUser
);
// @route   DEL admins/users/:id
// @desc    LOGIC to Delete a user
// @access  Private
router.delete(
  "/:id",
  middleware.isAdmin,
  adminUsersController.deleteSpecificUser
);
module.exports = router;
