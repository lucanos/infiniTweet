#jQuery quickie: Unlimited Scroll using the Twitter API

[Originally from http://www.marcofolio.net](http://www.marcofolio.net/webdesign/jquery_quickie_unlimited_scroll_using_the_twitter_api.html "View Original Article")

Time for another relatively simple jQuery tutorial, just like my previous jQuery quickie. At work, I'm currently working with Silverlight and implemented unlimited scroll. This is a great technique that could be used on loads of websites. Instead of the regular pagination, where the user has to click to see the next page, unlimited scroll automatically loads the next page when the user is at the bottom.

I wanted to take this technique and port it to another jQuery example. So the quickie for today is Unlimited scroll using jQuery. I've using the Twitter API to make the example, so you'll learn a little bit about JSON too.

Of course, you can use this same technique for something else instead of loading tweets, for example for loading next blog posts etc. Now, let's take a look at how you can create this Twitter example.

##HTML

Just for the purpose of the example and aiming the focus on the jQuery part, I've created the most simplistic and minimal HTML you'll need.

```
<div id="tweets">
   <!-- Tweets will get loaded from jQuery -->
</div>
<div id="overlay">
   <img src="images/ajax-loader.gif" />
</div>
```

The first division (`#tweets`) is placed as a container that will hold all the loaded tweets. The second one will function as the overlay with an AJAX loader, that'll be placed on top to indicate the request has been made.

Now to give this HTML some little bit of styling using CSS.

##CSS

I've used (almost) the same CSS styling as my Unique website for your Twitter updates Reloaded example.

We're using an absolute positioned division, just to keep the focus on the jQuery. Take note on the overflow : auto property: This will show the scrollbar.

```
#tweets { position: absolute; left: 186px; top: 105px;
   width: 376px; height:350px; overflow:auto; }
#tweets p { font-size: 14px; margin-bottom: 10px; padding: 10px;
   color: #7a8a99; background: url("../images/transpBlue.png"); }
```

We're also styling the paragraphs that'll be placed inside the #tweets container. Those will get injected by jQuery.

Since we're using absolute positioning, we can easily place the overlay on top of the container.

```
#overlay { position: absolute; left: 168px; top: 87px;
   width: 408px; height:386px; background: url("../images/transpBlue_overlay.png"); }
#overlay img { position:relative; left:200px; top:189px; }
```

As you can see, the image has been placed in the center of the container.

Nothing really exiting going on over here, but now comes the most fun part: the jQuery code!

##jQuery

After loading jQuery and waiting for the document to be ready with loading, we can start the jQuery script. First, we'll need a couple of variables. As usual, comments are added to make some things clear.

```
// Set the size for each page to load
var pageSize = 15;
  
// Username to load the timeline from
var username = 'marcofolio';
 
// Variable for the current page
var currentPage = 1;
```

Now, we need to call a function that'll load the first page.

```
// First time, directly load the tweets
loadTweets();
```

The loadTweets() code is wrapped inside a function, since we'll need to call it over and over to load more tweets. This is how it looks like:

```
// Loads the next tweets
var loadTweets = function() {
   var url = "http://twitter.com/status/user_timeline/"
         + username + ".json?count="+pageSize+"&page="+currentPage+"&callback=?";
         
   $.getJSON(url,function(data) {
      $.each(data, function(i, post) {
         appendTweet(post.text, post.id);
      });
      
      // We're done loading the tweets, so hide the overlay
      $("#overlay").fadeOut();
   });
};
```

As you can see, we retrieve the Twitter timeline by calling the API and retrieving the current page from the user. The jQuery getJSON functionality retrieves the data, and iterates over all results (the each function). There, the appendTweet function is called with the text and id from the tweet (other data could be loaded too).

After we're done loading the tweets, we hide the overlay. But wait - we're calling a function appendTweet that doesn't exist (yet)! Yup, you're right, so here it is:

```
// Appends the new tweet to the UI
var appendTweet = function(tweet, id) {
   $("<p />")
      .html(tweet)
      .append($("<a />")
            .attr("href", "http://twitter.com/" + username + "/status/" + id)
            .attr("title", "Go to Twitter status")
            .append($("<img />")
               .attr("src", "images/link.png")
            )
      )
   .appendTo($("#tweets"));
};
```

We're using the jQuery function to dynamically the tweet paragraphs. We also add the link to the tweet by showing an image. We append the new element to the #tweets container and we're done!

But now, we have the initial fill (the first page). We now need to detect that the user is scrolling the #tweets container and find out if he is at the bottom to load the next page.
 
Here's how this can be achieved:

```
// Append a scroll event handler to the container
$("#tweets").scroll(function() {
   // We check if we're at the bottom of the scrollcontainer
   if ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()) {
 
      // If we're at the bottom, show the overlay and retrieve the next page
      currentPage++;
      $("#overlay").fadeIn();
      loadTweets();
   }
});
```

Take note of the if condition to see if the user is at the bottom. When it is, the currentPage will get bigger, the overlay will fade in and the next tweets will get loaded.

##Conclusion

Unlimited scroll could be great for user experience (so the example with the Twitter API would be useful), but when you think about SEO, it's not recommended. After all, a search engine spider doesn't actually scroll.