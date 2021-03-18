import {writable} from 'svelte/store';

const meetups = writable([
    // {
    //     id: "m3",
    //     title: "Annoy Hussain",
    //     subtitle: "Annoyingly long and difficult JS challenges. Hehe.",
    //     description: "We will fuck him, and we'll fuck him well. We will make the little bitch into a man yet. Any dream is possible through surgery.",
    //     image:
    //       "https://i.ytimg.com/vi/AzdWIx_xwm0/hqdefault.jpg",
    //     address: "Trolololo Road 25, Londinium",
    //     contactEmail: "huss@test.com",
    //     isFavorite: false
    //   },
    // {
    //     id: "m1",
    //     title: "Coding Bootcamp",
    //     subtitle: "Learn to code in 2 hours",
    //     description: "In this meetup, we will have some experts that teach you how to code.",
    //     image: "https://toggl.com/blog/wp-content/uploads/2020/07/What-a-WeWork-Interior-Designer-Can-Teach-Us-About-Our-Workspace-2.jpg",
    //     address: "27th Nerd Road, 25342 New York",
    //     contactEmail: "code@test.com",
    //     isFavorite: false
    //   },
    //   {
    //     id: "m2",
    //     title: "Swim Together",
    //     subtitle: "Let/'s go swimming together!",
    //     description: "We will simply swim some rounds!",
    //     image:
    //       "https://d1s9j44aio5gjs.cloudfront.net/2020/03/empty_pool_image.jpg",
    //     address: "27th Nerd Road, 25342 New York",
    //     contactEmail: "swim@test.com",
    //     isFavorite: false
    //   },

])

const customMeetups = {
    subscribe: meetups.subscribe,

    setMeetups: (meetupArray) => {
        meetups.set(meetupArray)
    },

    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData
        }

        meetups.update(items => {
            return [newMeetup, ...items];
        })
    },

    updateMeetup: (id, meetupData) => {
        meetups.update(items => {
            const meetupIndex = items.findIndex(i => i.id === id);
            //Below method does a number of things: one, we create a new object
            //Then we select the meetup we want to edit.
            //This gives us all the data of that meetup. Then after the comma we
            //overwrite the object properties with the edited ones from our
            //EditMeetup.svelte. This way the 6 properties are overwritten with
            //new values
            const updatedMeetup = { ...items[meetupIndex], ...meetupData };
            const updatedMeetups = [...items];
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups;
        })
    },

    // updateMeetup: (id, meetupData) => {
    //     meetups.update(items => {
    //       const meetupIndex = items.findIndex(i => i.id === id);
        //   const updatedMeetup = { ...items[meetupIndex], ...meetupData };
        //   const updatedMeetups = [...items];
        //   updatedMeetups[meetupIndex] = updatedMeetup;
        //   return updatedMeetups;
    //     });
    //   },
    
    toggleFavorite: id => {
        console.log(id)
        meetups.update(items => {
            const updatedMeetup = {...items.find(m => m.id === id)} //clone the meetups array and grab the correct Meetup
            updatedMeetup.isFavorite = !updatedMeetup.isFavorite //If false then true, if true then false
            const meetupIndex = items.findIndex(m => m.id === id) //get the index of our meetup from array
            const updatedMeetups = [...items]
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups
        })

    },

    removeMeetup: id => {
        console.log(id)
        meetups.update(items => {
            return items.filter(i => i.id !== id)
        })
    }
}

export default customMeetups;