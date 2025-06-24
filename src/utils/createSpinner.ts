/**
 * Creates a terminal spinner that displays a rotating animation alongside a message.
 * The spinner runs in the terminal's standard output and can be stopped by invoking the returned function.
 *
 * @param message - The message to display next to the spinner animation.
 * @returns A function to stop the spinner and clear its output from the terminal.
 */
function createSpinner(message: string) {
  const spinnerFrames = ['|', '/', '-', '\\'];
  let frameIndex = 0;
  process.stdout.write('\n'); // Start spinner on a new line
  const spinnerInterval = setInterval(() => {
    process.stdout.write(`\r\x1b[34m${spinnerFrames[frameIndex]} ${message}\x1b[0m`); // Blue spinner
    frameIndex = (frameIndex + 1) % spinnerFrames.length;
  }, 100);

  return () => {
    clearInterval(spinnerInterval);
    process.stdout.write('\r\x1b[2K'); // Clear the spinner line
  };
}

export { createSpinner };
