window.addEventListener("load", function() {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ';
    const loadingTextElement = document.getElementById('loading-text');
    const loadingScreen = document.getElementById("loading-screen")
    
    // Function to generate loading text with centered LOADING and random characters
    function generateLoadingScreen(rows, cols, word) {
        let loadingText = ''; loadingText_arr = [];
        const beforeLoading = Math.floor((cols - word.length) / 2);
        const afterLoading = cols - beforeLoading - word.length;

        // Loop to generate rows of '*' with centered LOADING
        for (let i = 0; i < rows; i++) {
            let line = '*'.repeat(beforeLoading) + word + '*'.repeat(afterLoading);
            loadingText += line + '\n';
            loadingText_arr.push(line);
        }

        loadingTextElement.textContent = loadingText;
        return loadingText_arr;
    }
    function generateLoadingScreen2(rows, cols, repeater) {
        const pattern = repeater;
        const totalLength = rows * cols;
        let longString = pattern.repeat(Math.ceil(totalLength / pattern.length));
        // Slice the long string into rows of length 'cols'
        let loadingText = [];
        for (let i = 0; i < rows; i++) {
            let line = longString.slice(i * cols, (i + 1) * cols);
            loadingText.push(line);
        }

        return loadingText;
    }
    
    
    function randomiseRow(line){
//        console.log(line);
        let newLine = line
            .split('')
            .map((char, index) => {
                if (char!= '*') {
                    return randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                return char;
            })
            .join('');
        return newLine;
    };
    
    function overlay(text1, text2) {// overlays random text from both strings
        let modifiedText = '';
        for (let i = 0; i < text2.length; i++) {
            if (text2[i] === '*' && text1[i] === '*') {
                modifiedText += ['*'];
            } else {
                modifiedText += 'Z'; // any non * character
            }
        }
        return modifiedText;
    };
    
    let flkr_arr = [];
    function flickerEffect1(rows, cols, new_text){
        const lines = loadingTextElement.textContent.split('\n');
        let counter = 0; let flkrAcv = null;
        const curtain_speed = 50; curtain_delay = 900; //curtain parameters ms
        
        const flicker_curtain = setInterval(() => {
            if (counter < rows+Math.floor(curtain_delay/curtain_speed)) {// flickering screen plus curctain length
                flkr_arr.push(counter);
//                console.log(flkr_arr);
//                console.log(overlay(lines[counter],new_text[counter]));
                if (counter < rows) {lines[counter] = overlay(lines[counter],new_text[counter])} // changing the page
                
                let randomTime = 0;
                const flickerInterval = setInterval(() => {
                    if (randomTime < curtain_speed) {
                        for (let i of flkr_arr) {
                            if (lines[i]) {
                                let line_ = lines[i];
                                lines[i] = randomiseRow(line_);
                            }
                        }
                        loadingTextElement.textContent = lines.join('\n');
                        randomTime += 25;
                    } else {
                        clearInterval(flickerInterval);
                    }
                }, 25);
                counter++;
                flkrAcv = true;
            } else {
                clearInterval(flicker_curtain);
                flkrAcv = false;
            }
        }, curtain_speed);

        setTimeout(() => {
            let removeInterval = setInterval(() => {
                if (flkr_arr.length > 0) {
                    let final_ = flkr_arr.shift();
//                    console.log('Removing:', final_);
                    if (!flkrAcv) {flkr_arr=[]}// remove flkr arr if not flickering anymore
                    if (final_<rows) {
                        lines[final_] = new_text[final_];
                        loadingTextElement.textContent = lines.join('\n');
                    }
                }
                if (flkr_arr.length === 0 && counter > 1) {
                    clearInterval(removeInterval);
                }
            }, curtain_speed);
        }, curtain_delay); // Start removing after 1 seconds
        
    }

    let currentScreenIndx = 2;
    function updateLoadingScreen() {
        if (flkr_arr.length !== 0) {
            return; // Don't execute updateLoadingScreen if the condition is met
        }
        flickerEffect1(rows, cols, screens[currentScreenIndx]);
        console.log("Screen:", currentScreenIndx);
        currentScreenIndx++;
        if (currentScreenIndx >= screens.length) {// loop
            currentScreenIndx = 0;
        }
    }
    

    // Get the number of rows and columns based on the viewport size
    const rows = Math.floor(window.innerHeight / 25); // row height  ~1.2x fontsize
    const cols = Math.floor(window.innerWidth / 9);  // column width ~0.6x fontsize

    
    screen1 = generateLoadingScreen(rows, cols, 'LOADING');
    screen2 = generateLoadingScreen2(rows, cols, '***************************PLEASE*WAIT');
    screen3 = generateLoadingScreen2(rows, cols, '****************************A*LITTLE*BIT*MORE');
    screen4 = generateLoadingScreen2(rows, cols, '*******************NEARLY*THERE');
    screen5 = generateLoadingScreen2(rows, cols, '***************SO**************CLOSE');
    const screens = [screen1, screen2, screen3, screen4, screen5];


    // Set the interval to switch screens every
    flickerEffect1(rows, cols, screen2);
    let loadingInterval = setInterval(updateLoadingScreen, 100);
    

    // Hide the loading screen after 3 seconds (or when simulation is ready)
    setTimeout(() => {
        loadingScreen.classList.add("fadeOut");
        loadingScreen.addEventListener("transitionend", () => {
                    loadingScreen.style.display = "none"; // Hide after transition
                });
        clearInterval(loadingInterval);
    }, 5000); // Adjust loading time as necesary
});

