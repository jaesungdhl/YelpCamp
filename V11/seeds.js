var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Portola Redwoods State Park Campground",
        image: "https://travel.home.sndimg.com/content/dam/images/travel/fullset/2013/07/16/9a/california-camping.rend.hgtvcom.616.347.suffix/1491591965392.jpeg",
        description: "Great for families and group camps. Bathroom facilities + showers available."
    },
    {
        name: "Little Basic Cabins",
        image: "https://www.switchbacktravel.com/sites/default/files/images/articles/Camping%20Torres%20del%20Paine.jpg",
        description: "Restrooms, picnic areas are well maintained."
    },
    {
        name: "Big Basin Redwoods State Park",
        image: "https://www.active.com/Assets/Outdoors/redwood.jpg",
        description: "Kiking trails and other outdoor activities."
    },
    ];

function seedDB()
{
    Campground.deleteMany({},function(err)
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Removed campground.");
            
            data.forEach(function(data)
            {
                Campground.create(data, function(err, campground)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(campground);
                        Comment.create({text: "I would have wished there was internet",author: "John Lee"},function(err, newComment)
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                campground.comments.push(newComment);
                                campground.save(function(err, newInfo)
                                {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        console.log(newInfo);
                                    }
                                });
                            }
                        })
                    }
                })
            })
        }
    });
};

module.exports = seedDB;