$(document).ready( function() {
    
    function movieFinder() {
        const apiKey = "db0633cb7d87ac12e2e4f675d677f8a5";
        var title = $('input').val();
        var movieAPI = `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${apiKey}`;
        var movieOptions = {
            format: 'json',
            tag: title
        };
        
        function display(movie) {
            // empty HTML elements (4 slots for movies) before uploading new ones
            for (var i=0; i<=3; i++) {
                $('.no-results').html('');  
                $('#movie-block' + i).css('display', 'none');
                $('#movie-block' + i).removeClass('movie-block-active');
                $('#title' + i).empty();
                $('.description' + i).empty();
                $('#release-date' + i).empty();
                $('#poster' + i).attr('src', "");
            }
            // if there is completely no results display a message
            if (!movie.results[0]) {
                $('.no-results').html('Cannot find a movie');   
            } else {
                for (var i=0; i<=movie.results.length; i++) {
                    
                    // check if every element of movie object is avaiable
                    if ((movie.results[i]) && (movie.results[i].title) && (movie.results[i].overview) && (movie.results[i].poster_path)) {
                        $('#movie-block' + i).css('display', 'block');
                        $('#title' + i).html(movie.results[i].title);
                        $('.description' + i).html(movie.results[i].overview);
                        $('#release-date' + i).html(movie.results[i].release_date);
                        
                        // render poster if there is a path
                        if (movie.results[i].poster_path) {
                            const posterSize = 'w185';
                            $('#poster' + i).attr("src", `http://image.tmdb.org/t/p/${posterSize}/${movie.results[i].poster_path}`);
                        } else {
                            $('#poster' + i).attr("alt", "Poster not avaiable");   
                        }
                    } else {
                        $('#movie-block' + i).css('display', 'none');  
                    }
                }
            }
        }
        $.getJSON(movieAPI, movieOptions, display);
    }
    
    function overlay() {
        $('.movie-block').click(function() {
            $('.overlay').css('display', 'flex');
            var desc = $(this).find('.description').text();
            var posterURL = $(this).find('img').attr('src');
            var release = $(this).find('.release-date').text();
            var title = $(this).find('.title').text();
            $('.desc').html(desc);
            $('.poster-desc').attr('src', posterURL);
            $('.release-date-desc').html("(" + release + ")");
            $('.title-desc').html(title);
            $('.search-block, .movie-block, .title, .logo').addClass('blurred-background');
        });
        $('.overlay').click(function() {
            $(this).css('display', 'none'); 
            $('.search-block, .movie-block, .title, .logo').removeClass('blurred-background');
        });
    }
    
    overlay();
    
    $('.search-button').click(movieFinder);
    
    $('.search').keypress(function(e) {
        if (e.keyCode == 13) {
            movieFinder();    
        }
    });
    $('.search').click(function() {
        $(this).attr('placeholder', "");    
    });
});

