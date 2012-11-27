/*!
 * jQuery 'best options' plugin boilerplate
 * Author: @cowboy
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */


(function( $ ){

  $.fn.infiniTweet = function( options ){

        // Here's a best practice for overriding 'defaults'
        // with specified options. Note how, rather than a 
        // regular defaults object being passed as the second
        // parameter, we instead refer to $.fn.pluginName.options 
        // explicitly, merging it with the options passed directly 
        // to the plugin. This allows us to override options both 
        // globally and on a per-call level. 

    options = $.extend( {} , $.fn.infiniTweet.defaults , options );

    return this.each(function(){
    
      var $t = $(this);
      
      $t
        .addClass( 'infiniTweet' )
        .data( 'backgroundImage' , $t.css('background-image') )
        .scroll(function(){
          var $t2 = $(this);
          // We check if we're at the bottom of the scrollcontainer
          if( $t2[0].scrollHeight - $t2.scrollTop()==$t2.outerHeight() ){
            if( $t2.data( 'currentPage' )>=options.pageLimit ){
              $t2.append( options.pageLimitAlert );
              return false;
            }
            
            $t2
              .css( 'background-image' , $t2.data('backgroundImage') );
            $('p',$t2).fadeTo('normal',0.2);
            $.fn.infiniTweet.loadTweets( $t2 , options );
          }
        });
      
      $.fn.infiniTweet.loadTweets( $t , options );

    });
  };

  // Globally overriding options
  // Here are our publicly accessible default plugin options 
  // that are available in case the user doesn't pass in all 
  // of the values expected. The user is given a default
  // experience but can also override the values as necessary.
  // eg. $fn.pluginName.key ='otherval';

  $.fn.infiniTweet.defaults = {
    pageSize       :  15 ,
    pageLimit      : 10 ,
    pageLimitAlert : '<a class="pageLimitAlert" href="https://twitter.com/[username]">Click Here to View [username]\'s Twitter Page</a>' ,
    username       : 'lucanos' ,
    linkifyUser    : true ,
    linkifyHash    : true ,
    linkifyLink    : true ,
    template       : '[text]<br/><small>[relativeTime]</small>'
  };
  
  $.fn.infiniTweet.appendTweet = function( tweet , id , $parent , options ){
  
    if( options.template )
      tweet = $.fn.infiniTweet.mergeTemplate( options.template , tweet );

    if( options.linkifyLink )
      tweet = tweet.replace( /(https?:\/\/)([^\s\<\>]+)/g , '<a class="link" href="$1$2" title="Visit this link">$2</a>' );
    if( options.linkifyHash )
      tweet = tweet.replace( /\#([^\s\<\>\.]+)/g , '<a class="hashtag" href="https://twitter.com/search?q=%23$1" title="Search for $1 tagged Tweets">#$1</a>' );
    if( options.linkifyUser )
      tweet = tweet.replace( /\@([a-z0-9_]{1,15})/gi , '<a class="handle" href="https://twitter.com/$1" title="Go to $1\'s Twitter Page">@$1</a>' );

    tweet += '<a class="original" href="https://twitter.com/' + options.username + '/status/' + id + '" title="View this Tweet in Twitter">View this Tweet in Twitter</a>';

		$("<p />")
			.html(tweet)
      .appendTo( $parent );
  };
  
  $.fn.infiniTweet.loadTweets = function( $parent , options ){
    var currentPage = ( !$parent.data( 'currentPage' ) ? 0 : $parent.data( 'currentPage' ) )+1;
    var url = "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + options.username + "&count="+options.pageSize+"&page="+currentPage+"&callback=?";

    $.ajax({
      url : url ,
      dataType : 'json' ,
      success : function( data ){
        $.each( data , function( i , post ){
          $.fn.infiniTweet.appendTweet( post , post.id , $parent , options );
        });
        
        $( 'p' , $parent )
          .fadeTo('normal',1);
        $parent
          .data( 'currentPage' , currentPage )
          .css( 'background-image' , 'none' );
      } ,
      error : function(){
        $( 'p' , $parent )
          .fadeTo('normal',1);
        $parent
          .data( 'currentPage' , currentPage )
          .css( 'background-image' , 'none' );
      }
    });
  };
  
  $.fn.infiniTweet.mergeTemplate = function( template , tweet ){
    console.log( tweet );
    var placeholders = template.match( /[^\[]+(?=\])/g );
    for( var i=0 ; i<placeholders.length ; i++ ){
      if( tweet[placeholders[i]] )
        template = template.replace( '[' + placeholders[i] + ']' , tweet[placeholders[i]] );
      else if( $.fn.infiniTweet[placeholders[i]] )
        template = template.replace( '[' + placeholders[i] + ']' , $.fn.infiniTweet[placeholders[i]]( tweet ) );
    }
    return template;
  };
  
  $.fn.infiniTweet.relativeTime = function( tweet ){
    // Generate a JavaScript relative time for the tweets

    var pastTime = Date.parse( tweet.created_at );
    var origStamp = new Date( pastTime );
    var curDate = new Date();
    var currentStamp = curDate.getTime();
    var diff = parseInt( ( currentStamp - origStamp )/1000 );

    if( diff<0 )
      return 'Now?';
    if( diff<=5 )
      return 'Just now';
    if( diff<=20 )
      return 'Seconds ago';
    if( diff<=60 || parseInt( diff/60 )==1 )
      return 'A minute ago';
    if( diff<3600 )
      return parseInt( diff/60 )+' minutes ago';
    if( diff<=1.5*3600 || diff<23.5*3600==1 )
      return 'One hour ago';
    if( diff<23.5*3600 )
      return Math.round(diff/3600)+' hours ago';
    if( diff<1.5*24*3600 )
      return 'One day ago';

    // If the tweet is older than a day, show an absolute date/time value;

    var dateArr = ( origStamp.toDateString()+' '+origStamp.toLocaleTimeString() ).split( ' ' );

    return dateArr[4].replace(/\:\d+$/,'')+' '+dateArr[2]+' '+dateArr[1]+(dateArr[3]!=curDate.getFullYear()?' '+dateArr[3]:'');
  }
    
})( jQuery );
