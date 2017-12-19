/* Copyright (C) 2017 Nartin Väth <martin@mvath.de>
 * This project is under the GNU public license 2.0
*/

"use strict";

function getButtonsBase() {
  return document.getElementById("buttonsBase");
}

function getCheckboxOptions() {
  return document.getElementById("checkboxOptions");
}

function getButtonsRemove() {
  return document.getElementById("buttonsRemove");
}

function getButtonsMark() {
  return document.getElementById("buttonsMark");
}

function getSelectFolder() {
  return document.getElementById("selectFolder");
}

function getButtonsFolders() {
  return document.getElementById("buttonsFolders");
}

function getButtonStop() {
  return document.getElementById("buttonStop");
}

function getProgressBar() {
  return document.getElementById("progressBar");
}

function getTop() {
  return document.getElementById("tableBookmarks");
}

function getMessageNode() {
  return document.getElementById("textMessage");
}

function getCheckboxFullUrl() {
  return document.getElementById("checkboxFullUrl");
}

function getCheckboxExtra() {
  return document.getElementById("checkboxExtra");
}

function getSelectedFolder() {
  return document.getElementById("selectedFolder").value;
}

function displayCount(text) {
  document.getElementById("textCount").textContent = text;
}

function displayMessage(text, title) {
  const message = getMessageNode();
  message.textContent = text;
  if (title) {
    message.title = title;
    return;
  }
  message.removeAttribute("TITLE");
}

function getName(folders, parent, name) {
  while (parent || (parent === 0)) {
    const folder = folders[parent];
    name = folder.name + ' | ' + name;
    parent = folder.parent;
  }
  return name;
}

function appendTextNodeCol(row, text) {
  const col = document.createElement("TD");
  const textNode = document.createTextNode(text);
  col.appendChild(textNode);
  row.appendChild(col);
}

function appendCheckbox(parent, id, checked, disabled) {
  const checkbox = document.createElement("INPUT");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.id = id;
  if (disabled === true) {
    checkbox.disabled = true;
  }
  parent.appendChild(checkbox);
}

function appendCheckboxCol(row, id, checked, disabled) {
  const col = document.createElement("TD");
  appendCheckbox(col, id, checked, disabled);
  row.appendChild(col);
}

function appendButton(parent, id, titleId, text, titleText, enabled) {
  const button = document.createElement("BUTTON");
  button.type = "button";
  button.id = id;
  button.textContent = (text ? text : browser.i18n.getMessage(id));
  if (titleId) {
    button.title = browser.i18n.getMessage(titleId);
  } else if (titleText) {
    button.title = titleText;
  }
  if (!enabled) {
    button.disabled = true;
  }
  parent.appendChild(button);
}

function appendButtonCol(row, id, titleId, text, titleText, enabled) {
  const col = document.createElement("TD");
  appendButton(col, id, titleId, text, titleText, enabled);
  row.appendChild(col);
}

function appendButtonRow(parent, id, titleId, text, titleText, enabled) {
  const row = document.createElement("TR");
  appendButtonCol(row, id, titleId, text, titleText, enabled);
  parent.appendChild(row);
}

function addButtonsBase() {
  const parent = getButtonsBase();
  if (parent.hasChildNodes()) {  // Already done
    return;
  }
  const row = document.createElement("TR");
  appendButtonCol(row, "buttonListExactDupes", "titleButtonListExactDupes");
  appendButtonCol(row, "buttonListSimilarDupes",
    "titleButtonListSimilarDupes");
  appendButtonCol(row, "buttonListEmpty", "titleButtonListEmpty");
  appendButtonCol(row, "buttonListAll", "titleButtonListAll");
  parent.appendChild(row);
}

function addButtonRemove(buttonId, titleId) {
  const row = document.createElement("TR");
  const col = document.createElement("TD");
  col.width = "50pt";
  col.style.height = "50pt";
  row.append(col);
  appendButtonCol(row, buttonId, titleId);
  const parent = getButtonsRemove();
  parent.appendChild(row);
}

function addButtonsFolders(mode, enabled) {
  const parent = getButtonsFolders();
  if (parent.hasChildNodes()) {  // Already done
    return;
  }
  appendButtonRow(parent, "buttonMarkFolder", "titleButtonMarkFolder",
    null, null, enabled);
  appendButtonRow(parent, "buttonUnmarkFolder", "titleButtonUnmarkFolder",
    null, null, enabled);
  if (mode) {
    return;
  }
  appendButtonRow(parent, "buttonMarkFolderOther",
    "titleButtonMarkFolderOther", null, null, enabled);
  appendButtonRow(parent, "buttonMarkFolderButFirst",
    "titleButtonMarkFolderButFirst", null, null, enabled);
  appendButtonRow(parent, "buttonMarkFolderButLast",
    "titleButtonMarkFolderButLast", null, null, enabled);
  appendButtonRow(parent, "buttonMarkFolderButOldest",
    "titleButtonMarkFolderButOldest", null, null, enabled);
  appendButtonRow(parent, "buttonMarkFolderButNewest",
    "titleButtonMarkFolderButNewest", null, null, enabled);
}

function addSelectOption(select, content, value) {
  const option = document.createElement("OPTION");
  if (content) {
    option.textContent = content;
  }
  if (value) {
    option.value = value;
  }
  select.appendChild(option);
}

function addSelectFolder(result) {
  if (!result.foldersDisplay) {
    return;
  }
  const select = document.createElement("SELECT");
  select.title = browser.i18n.getMessage("titleSelectFolder");
  select.id = "selectedFolder";
  addSelectOption(select, browser.i18n.getMessage("OptionNonFolder"), "'");
  const folders = result.folders;
  for (let i = 0; i < folders.length; ++i) {
    if (!folders[i]) {
      continue;
    }
    const folder = folders[i];
    if (!folder.ids) {
      continue;
    }
    addSelectOption(select, getName(folders, folder.parent, folder.name),
      String(i));
  }
  const col = document.createElement("TD");
  col.appendChild(select);
  const row = document.createElement("TR");
  row.appendChild(col);
  const parent = getSelectFolder();
  parent.appendChild(row);
}

function addButtonsMark(mode) {
  const parent = getButtonsMark();
  if (!mode) {
    const row1 = document.createElement("TR");
    appendButtonCol(row1, "buttonMarkButFirst", "titleButtonMarkButFirst");
    appendButtonCol(row1, "buttonMarkButLast", "titleButtonMarkButLast");
    parent.appendChild(row1);
    const row2 = document.createElement("TR");
    appendButtonCol(row2, "buttonMarkButOldest", "titleButtonMarkButOldest");
    appendButtonCol(row2, "buttonMarkButNewest", "titleButtonMarkButNewest");
    parent.appendChild(row2);
  }
  let row = document.createElement("TR");
  appendButtonCol(row, "buttonMarkAll", "titleButtonMarkAll");
  appendButton(row, "buttonUnmarkAll", "titleButtonUnmarkAll");
  parent.appendChild(row);
}

function addButtonsMode(mode, result) {
  if (mode == 2) {
    addButtonRemove("buttonStripMarked", "titleButtonStripMarked");
  } else {
    addButtonRemove("buttonRemoveMarked", "titleButtonRemoveMarked");
  }
  addButtonsMark(mode);
  addSelectFolder(result);
}

function addProgressButton(textId, percentage) {
  const bar = getProgressBar();
  if (bar.firstChild) {
    bar.firstChild.value = percentage;
    return;
  }
  const progress = document.createElement("PROGRESS");
  progress.max = 100;
  progress.value = percentage;
  bar.appendChild(progress);
  const stop = getButtonStop();
  appendButton(stop, "buttonStop", null,
    browser.i18n.getMessage(textId), null, true);
}

function addCheckboxOptions(options, extra) {
  const row = document.createElement("TR");
  appendCheckboxCol(row, "checkboxFullUrl", options.fullUrl);
  appendTextNodeCol(row, browser.i18n.getMessage("checkboxFullUrl"));
  const parent = getCheckboxOptions();
  parent.appendChild(row);
  if (extra) {
    const rowExtra = document.createElement("TR");
    appendCheckboxCol(rowExtra, "checkboxExtra", options.extra);
    appendTextNodeCol(rowExtra, browser.i18n.getMessage("checkboxExtra"));
    parent.appendChild(rowExtra);
  }
}

function enableButtonsOf(top, enabled) {
  if (!top.hasChildNodes()) {
    return;
  }
  const disabled = ((enabled !== undefined) && !enabled);
  for (let child of top.childNodes) {
    if ((child.nodeName == "BUTTON") || (child.nodeName == "INPUT")
      || (child.nodeName == "SELECT")) {
      child.disabled = disabled;
    } else {
      enableButtonsOf(child, enabled);
    }
  }
}

function enableButtonsBase(enabled) {
  enableButtonsOf(getButtonsBase(), enabled);
}

function enableButtons(enabled) {
  enableButtonsBase(enabled);
  enableButtonsOf(getButtonsRemove(), enabled);
  enableButtonsOf(getButtonsMark(), enabled);
  enableButtonsOf(getSelectFolder(), enabled);
  enableButtonsOf(getButtonsFolders(), enabled);
  enableButtonsOf(getCheckboxOptions(), enabled);
}

function clearItem(top) {
  while (top.lastChild) {
    top.removeChild(top.lastChild);
  }
}

function clearProgressButton() {
  clearItem(getProgressBar());
  clearItem(getButtonStop());
}

function clearButtonsFolders() {
  clearItem(getButtonsFolders());
}

function clearButtonsMode() {
  clearItem(getButtonsRemove());
  clearItem(getButtonsMark());
  clearItem(getSelectFolder());
  clearButtonsFolders();
  clearItem(getCheckboxOptions());
}

function clearBookmarks() {
  displayCount("");
  clearItem(getTop());
}

function clearWindow() {
  clearProgressButton();
  clearButtonsMode();
  clearBookmarks();
}

function addRuler() {
  const ruler = document.createElement("HR");
  const col = document.createElement("TD");
  col.colSpan = 4;
  col.appendChild(ruler);
  const row =  document.createElement("TR");
  row.appendChild(col);
  const top = getTop();
  top.appendChild(row);
}

function addBookmark(bookmark, result) {
  const row = document.createElement("TR");
  appendCheckboxCol(row, bookmark.id,
    (result.checkboxes && (result.checkboxes.has(bookmark.id))));
  if (bookmark.order !== undefined) {
    appendTextNodeCol(row, String(bookmark.order));
    const dummy = document.createElement("TD");  // A dummy column for space
    row.appendChild(dummy);
  }
  const name = getName(result.folders, bookmark.parent, bookmark.text);
  const col = document.createElement("TD");
  if (bookmark.url) {
    const url = bookmark.url;
    row.title = url;
    const link = document.createElement("A");
    link.href = url;
    link.target = "_blank";
    link.textContent = name;
    link.referrerpolicy = 'no-referrer';
    col.appendChild(link);
    let add;
    if (result.options.fullUrl) {
      add = " " + url;
    } else if (result.options.extra && bookmark.extra) {
      add = " (" + bookmark.extra + ")";
    }
    if (add) {
      const textNode = document.createTextNode(add);
      col.appendChild(textNode);
    }
    row.appendChild(col);
  } else {
    appendTextNodeCol(row, text);
  }
  const top = getTop();
  top.appendChild(row);
}

function getCheckbox(node) {
  return node.firstChild.firstChild;
}

function setCheck(node, checked) {
  getCheckbox(node).checked = checked;
}

function isCheckbox(node) {
  return ((getCheckbox(node).nodeName) == "INPUT");
}

function getOrder(node) {
  return Number(node.childNodes[1].firstChild.nodeValue);
}

function mark(mode) {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  for (let node of top.childNodes) {
    if (isCheckbox(node)) {
      setCheck(node, mode);
    }
  }
}

function markButFirst() {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  let mark = false;
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {  // separator
      mark = false;
      continue;
    }
    setCheck(node, mark);
    mark = true;
  }
}

function markButLast() {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  let previousNode = null;
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {  // separator
      if (previousNode !== null) {
        setCheck(previousNode, false);
        previousNode = null;
      }
      continue;
    }
    if (previousNode !== null) {
      setCheck(previousNode, true);
    }
    previousNode = node;
  }
  if (previousNode !== null) {
    setCheck(previousNode, false);
  }
}

function markButOldest() {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  for (let node of top.childNodes) {
    if (isCheckbox(node)) {
      setCheck(node, (getOrder(node) != 1));
    }
  }
}

function markButNewest() {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  let largestSeen = 1;
  let largestNode = null;
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {  // separator
      if (largestNode !== null) {
        setCheck(largestNode, false);
        largestNode = null;
      }
      largestSeen = 1;
      continue;
    }
    const current = getOrder(node);
    if (current <= largestSeen) {
      setCheck(node, true);
      continue;
    }
    if (largestNode !== null) {
      setCheck(largestNode, true);
    }
    largestSeen = current;
    largestNode = node;
  }
  if (largestNode !== null) {
    setCheck(largestNode, false);
  }
}

function SplitNumber(text, begin) {
  if (text.substring(0, begin.length) !== begin) {
    return -1;
  }
  return Number(text.substring(begin.length));
}

function getSelectedIds(folders) {
  const value = getSelectedFolder();
  if (!value) {
    return null;
  }
  const ids = new Set(folders[Number(value)]);
  return ids;
}

function markFolder(folders, checked) {
  const ids = getSelectedIds(folders);
  if (!ids) {
    return;
  }
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {
      continue;
    }
    const checkbox = getCheckbox(node);
    if (!ids.has(checkbox.id)) {
      continue;
    }
    checkbox.checked = checked;
  }
}

function markFolderGroup(folders, mode) {
  const ids = getSelectedIds(folders);
  if (!ids) {
    return;
  }
  const top = getTop();
  if (!top.hasChildNodes()) {
    return;
  }
  let checkTime = 0;
  let checkedOthers = false;
  if (mode == "oldest") {
    checkTime = -1;
  } else if (mode == "newest") {
    checkTime = 1;
  } else if (mode == "other") {
    checkedOthers = true;
  }
  const checkedMe = !checkedOthers;
  let checkboxesOthers = new Array();
  let checkboxesMe = new Array();
  let groupMatches = false;
  let dateMatch;
  let dateSeen = 0;
  function MarkGroup() {
    if (!groupMatches) {
      return;
    }
    for (let checkbox of checkboxesOthers) {
      checkbox.checked = checkedOthers;
    }
    let exclude = null;
    if (!checkboxesOthers.length) {
      if (mode == "first") {
        exclude = 1;
      } else if (mode == "last") {
        exclude = checkboxesMe.length;
      } else if (checkTime) {
        exclude = dateMatch;
      }
    }
    let i = 0;
    for (let checkbox of checkboxesMe) {
      ++i;
      checkbox.checked = ((i !== exclude) ? checkedMe : checkedOthers);
    }
  }
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {  // separator
      MarkGroup();
      if (checkboxesOthers.length) {  // test for speed reasons
        checkboxesOthers = new Array();
      }
      if (checkboxesMe.length) {  // test for speed reasons
        checkboxesMe = new Array();
      }
      groupMatches = false;
      dateSeen = 0;
      continue;
    }
    const checkbox = getCheckbox(node);
    if (!ids.has(checkbox.id)) {
      checkboxesOthers.push(checkbox);
      continue;
    }
    groupMatches = true;
    checkboxesMe.push(checkbox);
    if (!checkTime) {
      continue;
    }
    const current = getOrder(node);
    if (dateSeen) {
      if (checkTime > 0) {
        if (current < dateSeen) {
          continue;
        }
      } else if (current >= dateSeen) {
        continue;
      }
    }
    dateSeen = current;
    dateMatch = checkboxesMe.length;
  }
  MarkGroup();
  checkboxesOthers = checkboxesMe = null;  // free closures
}

function checkboxesToSet(result) {
  if (result.checkboxes) {
    result.checkboxes = new Set(result.checkboxes);
  }
}

function displayDupes(exact, result) {
  clearProgressButton();
  let total = 0;
  const groups = result.list.length;
  let returnValue = false;
  for (let group of result.list) {
    if (returnValue) {
      addRuler();
    } else {
      returnValue = true;
      addButtonsMode(0, result);
      addCheckboxOptions(result.options, !exact);
      checkboxesToSet(result);
    }
    total += group.length;
    for (let bookmark of group) {
      addBookmark(bookmark, result);
    }
  }
  displayMessage(browser.i18n.getMessage((exact ?
      "messageExactMatchesGroups" : "messageSimilarMatchesGroups"),
      [String(total), String(groups), String(result.all)]),
    browser.i18n.getMessage((exact ?
      "titleMessageExactMatchesGroups" : "titleMessageSimilarMatchesGroups")));
  return returnValue;
}

function displayEmpty(result) {
  clearProgressButton();
  const total = result.list.length;
  displayMessage(browser.i18n.getMessage("messageEmpty", String(total)),
    browser.i18n.getMessage("titleMessageEmpty"));
  if (!total) {
    return false;
  }
  addButtonsMode(1, result);
  checkboxesToSet(result);
  for (let bookmark of result.list) {
    addBookmark(bookmark, result);
  }
  return true;
}

function displayAll(result) {
  clearProgressButton();
  const total = result.list.length;
  displayMessage(browser.i18n.getMessage("messageAll", String(total)),
    browser.i18n.getMessage("titleMessageAll"));
  if (!total) {
    return false;
  }
  addButtonsMode(2, result);
  addCheckboxOptions(result.options);
  checkboxesToSet(result);
  for (let bookmark of result.list) {
    addBookmark(bookmark, result);
  }
  return true;
}

function sendMessageCommand(command) {
  const message = {
    command: command
  };
  browser.runtime.sendMessage(message);
}

function calculating(command) {
  clearWindow();
  sendMessageCommand(command);
}

function pushMarked(idList) {
  const top = getTop();
  if (!top.hasChildNodes()) {
    return 0;
  }
  let count = 0;
  for (let node of top.childNodes) {
    if (!isCheckbox(node)) {
      continue;
    }
    const checkbox = getCheckbox(node);
    if (!checkbox.checked) {
      continue;
    }
    if (idList) {
      idList.push(checkbox.id);
    } else {
      ++count;
    }
  }
  return count;
}

function processMarked(remove) {
  displayMessage(browser.i18n.getMessage(remove ?
  "messageRemoveMarked" : "messageStripMarked"));
  const removeList = new Array();
  pushMarked(removeList);
  clearWindow();
  const message = {
    command: (remove ? "remove" : "strip"),
    removeList: removeList
  };
  browser.runtime.sendMessage(message);
}

function displayProgress(textId, buttonTextId, state) {
  const todo = state.todo;
  const total = state.total;
  const percentage = (100 * total) / todo;
  addProgressButton(buttonTextId, percentage);
  displayMessage(browser.i18n.getMessage(textId,
    [String(total), String(todo), String(Math.round(percentage))]))
}

function displayFinish(textId, state) {
  clearProgressButton();
  if (state.error) {
    displayMessage(browser.i18n.getMessage(textId,
      [state.error, String(state.total)]));
  } else {
    displayMessage(browser.i18n.getMessage(textId, String(state.total)));
  }
}

{
  let firstcall = true;
  let lock = true;
  let count = null;
  let markMode = null;
  let folders;

  function startLock() {
    lock = true;
    enableButtons(false);
  }

  function endLock() {
    lock = false;
    enableButtons();
  }

  function addCheckboxes(message) {
      // We send an array, because a set has to be built by the client anyway
      const checkboxes = new Array();
      pushMarked(checkboxes);
      const count = checkboxes.length;
      if (count) {  // Send only nonempty arrays
        message.checkboxes = checkboxes;
      }
      return count;
  }

  function countMarked(send) {
    if (count === null) {
      return;
    }
    let currentCount;
    if (send) {
      const message = {
        command: "setCheckboxes"
      };
      currentCount = addCheckboxes(message);
      browser.runtime.sendMessage(message);
    } else {
      currentCount = pushMarked();
    }
    if (currentCount == count) {
      return;
    }
    count = currentCount;
    displayCount(browser.i18n.getMessage("messageCount", currentCount));
  }

  function setCheckboxOptions() {
    if (lock) {
      return;
    }
    startLock();
    const message = {
      command: "setOptions",
      fullUrl: getCheckboxFullUrl().checked
    };
    const checkboxExtra = getCheckboxExtra();
    if (checkboxExtra) {
      message.extra = checkboxExtra.checked;
    }
    addCheckboxes(message);
    clearWindow();
    browser.runtime.sendMessage(message);
  }

  function checkboxListener(event) {
    if ((!event.target) || (!event.target.id)) {
      return;
    }
    switch (event.target.id) {
      case "checkboxFullUrl":
      case "checkboxExtra":
        setCheckboxOptions();
        return;
    }
    countMarked(true);
  }

  function toggleButtonsFolders() {
    const haveSelected = (markMode !== null);
    if (haveSelected) {
      const name = getSelectedFolder();
      if ((!name) || (name === "'")) {
        haveSelected = false;
      }
    }
    if (!haveSelected) {
      clearButtonsFolders();
      return;
    }
    addButtonsFolders(markMode, !lock);
  }

  function selectListener(event) {
    if ((!event.target) || (!event.target.id)) {
      return;
    }
    switch (event.target.id) {
      case "selectedFolder":
        toggleButtonsFolders();
    }
  }

  function clickListener(event) {
    if ((!event.target) || (!event.target.id)) {
      return;
    }
    if (event.target.id == "buttonStop") {
      sendMessageCommand("stop");
      return;
    }
    if (lock || (event.button && (event.button != 1)) ||
      (event.buttons && (event.buttons != 1))) {
      return;
    }
    startLock();
    switch (event.target.id) {
      case "buttonListExactDupes":
        calculating("calculateExactDupes");
        return;
      case "buttonListSimilarDupes":
        calculating("calculateSimilarDupes");
        return;
      case "buttonListEmpty":
        calculating("calculateEmptyFolder");
        return;
      case "buttonListAll":
        calculating("calculateAll");
        return;
      case "buttonRemoveMarked":
        processMarked(true);
        return;
      case "buttonStripMarked":
        processMarked(false);
        return;
      case "buttonMarkAll":
        mark(true);
        break;
      case "buttonMarkButFirst":
        markButFirst();
        break;
      case "buttonMarkButLast":
        markButLast();
        break;
      case "buttonMarkButOldest":
        markButOldest();
        break;
      case "buttonMarkButNewest":
        markButNewest();
        break;
      case "buttonUnmarkAll":
        mark(false);
        break;
      case "buttonMarkFolder":
        markFolder(folders, true);
        break;
      case "buttonUnmarkFolder":
        markFolder(folders, false);
        break;
      case "buttonMarkFolderOther":
        markFolderGroup(folders, "other");
        break;
      case "buttonMarkFolderButFirst":
        markFolderGroup(folders, "first");
        break;
      case "buttonMarkFolderButLast":
        markFolderGroup(folders, "last");
        break;
      case "buttonMarkFolderButOldest":
        markFolderGroup(folders, "oldest");
        break;
      case "buttonMarkFolderButNewest":
        markFolderGroup(folders, "newest");
        break;
      case "checkboxFullUrl":
        endLock();
        return;
    }
    countMarked(true);
    endLock();
  }

  function messageListener(message) {
    if (message.command !== "state") {
      return;
    }
    if (firstcall) {
      addButtonsBase();
    }
    const state = message.state;
    folders = count = markMode = null;
    let selectMode;
    let newMarkMode = null;
    switch (state.mode) {
      case "virgin":
        endLock();
        return;
      case "removeProgress":
        displayProgress("messageRemoveProgress", "buttonStopRemoving", state);
        return;
      case "stripProgress":
        displayProgress("messageStripProgress", "buttonStopStripping", state);
        return;
      case "calculatingProgress":
        displayMessage(browser.i18n.getMessage("messageCalculating"));
        return;
      case "calculatedDupesExact":
        newMarkMode = 0;
        selectMode = displayDupes(true, state.result);
        break;
      case "calculatedDupesSimilar":
        newMarkMode = 0;
        selectMode = displayDupes(false, state.result);
        break;
      case "calculatedEmptyFolder":
        newMarkMode = 1;
        selectMode = displayEmpty(state.result);
        break;
      case "calculatedAll":
        newMarkMode = 1;
        selectMode = displayAll(state.result);
        break;
      case "removeSuccess":
        displayFinish("messageRemoveSuccess", state);
        break;
      case "stripSuccess":
        displayFinish("messageStripSuccess", state);
        break;
      case "removeError":
        displayFinish("messageRemoveError", state);
        break;
      case "stripError":
        displayFinish("messageStripError", state);
        break;
      case "calculateError":
        displayFinish("messageCalculateError", state);
        break;
      default:  // should not happen
        displayMessage(state.mode);  // it is a bug if we get here
        return;
    }
    if (!selectMode) {
      sendMessageCommand("finish");
      return;
    }
    markMode = newMarkMode;
    count = -1;
    countMarked(false);
    if (state.result && state.result.foldersDisplay) {
      folders = new Array();
      for (let folder of state.result.folders) {
        folders.push((folder && folder.ids) ? folder.ids : null);
      }
    }
    endLock();
  }

  document.addEventListener("CheckboxStateChange", checkboxListener);
  document.addEventListener("click", clickListener);
  document.addEventListener("change", selectListener);
  browser.runtime.onMessage.addListener(messageListener);
}
sendMessageCommand("sendState");