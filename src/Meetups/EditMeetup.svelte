<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty } from "../helpers/validation";
  import { isValidEmail } from "../helpers/validation";
  import meetups from "./meetup-store.js";

  export let id = null;

  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let image = "";
  let description = "";

  if (id) {
    const unsubscribe = meetups.subscribe((items) => {
      const selectedMeetup = items.find((i) => i.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      email = selectedMeetup.contactEmail;
      image = selectedMeetup.image;
      description = selectedMeetup.description;
    });

    unsubscribe();
  }

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: emailValid = isValidEmail(email);
  $: imageValid = !isEmpty(image);
  $: descriptionValid = !isEmpty(description);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    emailValid &&
    imageValid &&
    descriptionValid;

  function submitForm() {
    const meetupData = {
      title: title,
      subtitle: subtitle,
      address: address,
      image: image,
      contactEmail: email,
      description: description,
    };

    if (id) {
      fetch(
        `https://svelte-meetups-302c3-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(meetupData),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          if(!res.ok){
            throw new Error('Error, EditMeetup')
          }
          meetups.updateMeetup(id, meetupData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(
        "https://svelte-meetups-302c3-default-rtdb.europe-west1.firebasedatabase.app/meetups.json",
        {
          method: "POST",
          body: JSON.stringify({ ...meetupData, isFavorite: false }),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then((data) => {
          meetups.addMeetup({
            ...meetupData,
            isFavorite: false,
            id: data.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    dispatch("save");
  }

  function cancel() {
    dispatch("cancel");
  }

  function deleteMeetup() {
    meetups.removeMeetup(id);
    dispatch("save");
  }
</script>

<Modal title="Edit Meetup" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      type="text"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={title}
      on:input={(event) => (title = event.target.value)}
    />
    <TextInput
      id="subtitle"
      label="Subtitle"
      type="text"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)}
    />
    <TextInput
      id="address"
      label="Address"
      type="text"
      valid={addressValid}
      validityMessage="Please enter a valid address."
      value={address}
      on:input={(event) => (address = event.target.value)}
    />
    <TextInput
      id="imageUrl"
      label="Image URL"
      type="text"
      valid={imageValid}
      validityMessage="Please enter a valid image link."
      value={image}
      on:input={(event) => (image = event.target.value)}
    />
    <TextInput
      id="email"
      label="Email"
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid email."
      value={email}
      on:input={(event) => (email = event.target.value)}
    />
    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      value={description}
      on:input={(event) => (description = event.target.value)}
    />
    <!-- <Button type="submit">Save</Button> -->
  </form>
  <div slot="footer">
    <Button type="Button" on:click={cancel}>Cancel</Button>
    <Button type="Button" on:click={submitForm} disabled={!formIsValid}>
      {id ? "Edit Meetup" : "Add Meetup"}
    </Button>
    {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>

<style>
  form {
    width: 100%;
  }
</style>
