const _console_log = console.log;
const _console_error = console.error;
console.log = function () {
  _console_log(...arguments);
  const log_enable = document.getElementById('log-enable');
  if (log_enable != null && log_enable.checked) {
    _append_log(...arguments);
  }
}
console.error = function () {
  _console_error(...arguments);
  const log_enable = document.getElementById('log-enable');
  if (log_enable != null && log_enable.checked) {
    _append_log(...arguments);
  }
}
const _append_log = function () {
  const log_el = document.createElement('div');
  var logs = [];
  for (var i in arguments) {
    logs.push(arguments[i]);
  }
  log_el.innerText = logs.join(' ');
  
  var logEl = document.getElementById('log');
  if (logEl != null) {
    logEl.append(log_el);
  }
}
window.onerror = function (message, source, lineno, colno, error) {
  console.log("Error: " + message + "\n" + "Source: " + source + "\n" + "Line: " + lineno + "\n" + "Column: " + colno + "\n" + "Stack: " + error.stack);
}
