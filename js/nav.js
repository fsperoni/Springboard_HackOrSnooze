"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin")
  $(".main-nav-links").show()
  $navLogin.hide()
  $navLogOut.show()
  $navUserProfile.text(`${currentUser.username}`).show()
}

/** Show new story form on click on "submit" */
function navSubmitClick(evt) {
  console.debug("navSubmitClick")
  hidePageComponents()
  $allStoriesList.show()
  $newStoryForm.show()
}

$navSubmit.on("click", navSubmitClick)

/** Show favorite stories form on click on "favorites" */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick")
  hidePageComponents()
  putFavoritesOnPage()
}

$navFavorites.on("click", navFavoritesClick)

/** Show user's stories form on click on "my stories" */
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick")
  hidePageComponents()
  putUserStoriesOnPage()
}

$navMyStories.on("click", navMyStoriesClick)

