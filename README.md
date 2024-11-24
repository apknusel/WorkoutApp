# WorkoutApp
A workout application to go with the workout device I made

## Notes
```
- all files you need to make are made by going to File -> New File -> C -> and then either "c header file" or "c source file"
- in "Source Files" folder, create a new C file and call it whatever you want (e.g. "stuff.c"), this should be a c source file type
- in "stuff.c", use #include and include a header file (e.g. "stuff.h"), put in the rest of your functions inside stuff.c, make sure you get rid of the main function
- make "stuff.h" inside of the Header Files folder of your project, this should be a c header file type
- inside "stuff.h", include any outside header files you use (e.g. <avr/io.h>), then inside "#ifndef STUFF_H", put in function declarations for each function you had made in stuff.c
- you can now use the functions in stuff.c inside of your main file as normal, as long as you include the stuff.h file at the top of the main file
```