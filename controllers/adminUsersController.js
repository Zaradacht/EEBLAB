const User = require("../models/User");
const TempUser = require("../models/TempUser");

exports.showUsers = (req, res, next) => {
  User.find({})
    .then(users => {
      if (!users) {
        req.flash("error", "No users to show at the moment");
      }
      // user requests count:
      TempUser.find()
        .count()
        .then(c => {
          req.flash("success", "found users! ");
          return res.render("admin/users/index", { users, requestCount: c }); // in view do : if(users.length > 0)
        })
        .catch(err => {
          console.error("err : " + err);
          req.flash("error", "An error has occured");
          res.redirect("back");
        });
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.showUsersRequests = (req, res, next) => {
  TempUser.find({})
    .then(users => {
      if (!users) {
        req.flash("error", "No user requests found");
      } else {
        return res.render("admin/users/requests", { users });
      }
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.approveUserRequest = (req, res, next) => {
  const id = req.params.id;
  TempUser.findById(id)
    .then(tempUser => {
      // create a new user
      const newUser = {
        username: tempUser.username,
        password: tempUser.password,
        email: tempUser.email,
        cin: tempUser.cin,
        phonenumber: tempUser.phonenumber,
        firstname: tempUser.firstname,
        lastname: tempUser.lastname
      };
      res.locals = { ...newUser };
      this.createNewUser(req, res, next);
      this.deleteUserRequest(req, res, next);
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.deleteUserRequest = (req, res, next) => {
  const id = req.params.id;
  TempUser.findByIdAndDelete(id)
    .then(tempusr => {
      req.flash("success", "Deleted the request successfully");
      return res.redirect("admins/users");
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.newUserForm = (req, res, next) => {
  return res.render("admin/users/register");
};

exports.createNewUser = (req, res, next) => {
  const data = { ...res.locals };
  User.find({ username: data.username })
    .then(user => {
      if (user & (Object.keys(user).length > 0)) {
        req.flash("error", "username already in use");
        return res.redirect("back");
      } else {
        const newUser = new User({
          username: data.username,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
          cin: data.cin,
          email: data.email,
          phonenumber: data.phonenumber
        });
        newUser
          .save()
          .then(user => {
            req.flash("success", "created user successfuly");
            return res.redirect("/admins/users");
          })
          .catch(err => {
            console.error("err : " + err);
            req.flash("error", err);
            res.redirect("back");
          });
      }
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.showSpecificUser = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      if (!user) {
        req.flash("error", "Can't find the specific user, please check the ID");
        res.redirect("back");
      } else {
        res.render("admin/users/show", { user });
      }
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.editSpecificUser = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      if (!user) {
        req.flash("error", "Can't find the specific user, please check the ID");
        res.redirect("back");
      } else {
        res.render("admin/users/edit", { user });
      }
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.updateSpecificUser = (req, res, next) => {
  const data = { ...res.locals };
  console.log("req.params.id = " + req.params.id);
  User.findById({ _id: req.params.id })
    .then(user => {
      if (!user) {
        req.flash("error", "No user found, please check the ID");
        return res.redirect("back");
      } else {
        user.password = data.password;
        user
          .save()
          .then(usr => {
            req.flash("success", "Successfuly updated!");
            return res.redirect("/admins/users/" + usr.id);
          })
          .catch(err => {
            console.error("err : " + err);
            req.flash("error", "An error has occured");
            res.redirect("back");
          });
      }
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};

exports.deleteSpecificUser = (req, res, next) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then(user => {
      req.flash("success", "user: " + user.username + " Successfuly deleted!");
      return res.redirect("/admins/users/");
    })
    .catch(err => {
      console.error("err : " + err);
      req.flash("error", "An error has occured");
      res.redirect("back");
    });
};
