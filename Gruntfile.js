/**
 * TODO: Nettoyer !
 * TODO: Structuer les taches.
 * TODO: Essayer Juice pour remplacer Premailer. https://github.com/leemunroe/grunt-email-workflow/blob/master/grunt/juice.js
 */

module.exports = function(grunt) {
    // require it at the top and pass in the grunt instance
    require('time-grunt')(grunt);

    var imageminMozjpeg = require('imagemin-mozjpeg');

    // Project configuration.
    grunt.initConfig({

        //Next we can read in the project settings from the package.json file into the pkg property.
        //This allows us to refer to the values of properties within our package.json file, as we'll see shortly.
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Project paths setup
         */
        paths: {


            // assets folder name.
            assets: 'assets',

            //  where to store compiled files.
            compile: 'compile',

            // where to store built files.
            dist: 'dist',

            // sources
            src: {
                path: 'src',
                less: '<%= paths.src.path %>/styles/less/',
                layouts: '<%= paths.src.path %>/layouts/',
                emails: '<%= paths.src.path %>/emails/',
                partials: '<%= paths.src.path %>/partials/',
                data: '<%= paths.src.path %>/data/',
                helpers: '<%= paths.src.path %>/helpers/',
                img: '<%= paths.src.path %>/img/'
            },

            // Le domaine qui héberge les images.
            remoteAssetsDomain: 'http://preprod.lahautesociete.com/petzl/petzl_newsletter/'
        },

        // secrets.json is ignored in git because it contains sensitive data
        // See the README for configuration settings
        vault: grunt.file.readJSON('vault.json'),

        // Optimise les images et les place dans le dossier assets/img
        imagemin: {
            dynamic: {
                options: { // Target options
                    optimizationLevel: 3, // png
                    svgoPlugins: [{
                        removeViewBox: false
                    }],
                    //use: [imageminMozjpeg({quality: 10})]           // jpg compress.
                }, // Target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= paths.src.path.img %>', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: '<%= paths.compile %>/<%= paths.assets %>/' // Destination path prefix
                }]
            }
        },

        // Vider les dossiers de compil/dist/...
        clean: {
            build: {
                src: ['<%= paths.compile %>/*', '<%= paths.dist %>/*']
            }
        },

        // Compiler les fichiers less.
        less: {
            dev: {},
            dist: {
                options: {
                    paths: ['<%= paths.src.less %>']
                },
                files: {
                    '<%= paths.compile %>/<%= paths.assets %>/css/main.css': '<%= paths.src.less %>/main.less'
                }
            }
        },

        // "Assembler" les layouts avec leurs contenus (handlebars).
        assemble: {
            options: {
                layoutdir: '<%= paths.src.layouts %>',
                assets: '<%= paths.compile %>/<%= paths.assets %>',
                partials: ['<%= paths.src.partials %>/**/*.hbs'],
                data: ['<%= paths.src.data %>/data.json'],
                helpers: ['<%= paths.src.helpers %>/myHelpers.js'],
                flatten: true,
                toto: 'tutu'
            },
            dist: {
                options: {
                    //baseUrl: '<%= paths.distDomain %>'
                },
                src: ['<%= paths.src.emails %>/*.hbs'],
                dest: '<%= paths.compile %>/'
            }
        },

        // Copier les assets (images) dans 'dist".
        copy: {
            files: {
                cwd: '<%= paths.compile %>/', // set working folder / root to copy
                src: ['<%= paths.assets %>/img/**/*.*'], // copy all files and subfolders
                dest: '<%= paths.dist %>/', // destination folder
                expand: true // required when using cwd
            }
        },


        // "Inliner" les styles.
        premailer: {
            dist: {
                options: {
                    removeComments: false,
                    verbose: true,
                    ioException: true
                },
                files: [{
                    cwd: '<%= paths.compile %>/',
                    expand: true,
                    src: ['*.html'],
                    dest: '<%= paths.dist %>/'
                }]
            }
        },


        // Préfixe le chemin des images avec 'remoteAssetsDomain'. Les images doivent être préalablement placées sur le domaine 'à la main (ftp)'.
        cdn: {
            options: {
                /** @required - root URL of your CDN (may contains sub-paths as shown below) */
                cdn: '<%= paths.remoteAssetsDomain %>',
                /** @optional  - if provided both absolute and relative paths will be converted */
                flatten: true,
                /** @optional  - if provided will be added to the default supporting types */
                supportedTypes: 'html'
            },
            dist: {
                /** @required  - gets sources here, may be same as dest  */
                cwd: '<%= paths.dist %>',
                /** @required  - puts results here with respect to relative paths  */
                dest: '<%= paths.dist %>',
                /** @required  - files to process */
                src: ['{,*/}*.html', '{,**/}*.html'],
            }
        },

        // Use Mailgun option if you want to email the design to your inbox or to something like Litmus
        mailgun: {
            mailer: {
                options: {
                    key: "<%= vault.mailgun.api_key %>", // Enter your Mailgun API key here
                    sender: "<%= vault.mailgun.sender %>",
                    recipient: "<%= vault.mailgun.recipient %>",
                    subject: "Newslettr <%= grunt.template.today(\'yyyy-mm-dd-HH:MM\') %>"
                },
                src: '<%= paths.dist %>/*.html'
            }
        },


        // Watches for changes to css or email templates then runs grunt tasks
        watch: {
            options: {
                livereload: true,
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['default']
            },
            src: {
                files: ['<%= paths.src.less %>/*', '<%= paths.src.emails %>/*', '<%= paths.src.layouts %>/*', '<%= paths.src.partials %>/*', '<%= paths.src.data %>/*'],
                tasks: ['default']

            }
        }

    });



    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mailgun');
    grunt.loadNpmTasks('grunt-premailer');
    grunt.loadNpmTasks('grunt-cdn');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Default task(s). On vide les dossiers 'compile' et 'dist'. On less. On assemble dans 'compile'. On optimise les images (et les copie dans 'compile/assets/img').
    grunt.registerTask('default', ['clean', 'less', 'assemble', 'imagemin']);

    // Dist. On fait la tache 'default'. On copy les éléments de 'compile' vers 'dist'. On inline les style.
    grunt.registerTask('dist', ['default', 'copy', 'premailer']);

    // Send. On fait la tache 'dist'. On change les liens des images. On envoie le/les emails. 
    grunt.registerTask('send', ['dist', 'cdn', 'mailgun']);

};
