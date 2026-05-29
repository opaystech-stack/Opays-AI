/**
 * ====================================================================
 * OPAYS HQ - WORKSPACE OS
 * ====================================================================
 * Fichier : Code.gs (Backend Google Apps Script)
 * Version : 2.0.0
 * Auteur  : Antigravity (Opays Tech AI R&D)
 * Description : Moteur backend d'exploitation 100% natif Google Workspace.
 *               Gère la base Sheets, Calendar/Meet, Drive et Gmail.
 * ====================================================================
 */

/* ─────────────────── INITIALISATION ─────────────────── */

/**
 * Charge la page web principale (SPA)
 */
function doGet(e) {
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle('Opays HQ — Workspace OS')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (err) {
    Logger.log("Erreur doGet: " + err.toString());
    return HtmlService.createHtmlOutput("<h1>Erreur d'initialisation</h1><p>" + err.message + "</p>");
  }
}

/**
 * Initialise les feuilles de calcul de la base de données si inexistantes
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schema = {
    'Users': [
      ['Email', 'Name', 'Role', 'Status'],
      ['lamsa.fenelon@gmail.com', 'Fénelon Lamsasiri', 'CEO', 'Active'],
      ['princebagh@gmail.com', 'Prince Bagheni', 'COO', 'Active'],
      ['patriciazamwana@gmail.com', 'Patricia Zamwana', 'Opérations', 'Active'],
      ['zainabwale@gmail.com', 'Zaina Bwale Godlove', 'Design', 'Active']
    ],
    'Tasks': [
      ['Id', 'Entity', 'Title', 'Assignee', 'DueDate', 'Priority', 'Status']
    ],
    'Clients': [
      ['Id', 'Entity', 'Name', 'PipelineStatus', 'Budget', 'Contact']
    ],
    'Expenses': [
      ['Id', 'Entity', 'Title', 'Amount', 'Date', 'Category']
    ],
    'Settings': [
      ['Key', 'Value'],
      ['DRIVE_FOLDER_ID', 'root'],
      ['THEME', 'DARK'],
      ['MODULES_VISIBLE', 'DASHBOARD,TASKS,CALENDAR,CRM,FINANCES,DRIVE,EMAIL']
    ]
  };

  for (let sheetName in schema) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, schema[sheetName].length, schema[sheetName][0].length)
           .setValues(schema[sheetName]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, schema[sheetName][0].length).setFontWeight("bold");
    }
  }
  return "Database Ready";
}

/* ─────────────────── SESSION & UTILISATEURS ─────────────────── */

/**
 * Récupère les informations de l'utilisateur actif et son rôle
 */
function getUserSession() {
  try {
    initDatabase();
    const email = Session.getActiveUser().getEmail() || "lamsa.fenelon@gmail.com";
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    const data = sheet.getDataRange().getValues();
    
    let user = {
      email: email,
      name: email.split('@')[0],
      role: 'Collaborator',
      status: 'Active'
    };
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toLowerCase() === email.toLowerCase()) {
        user.name = data[i][1];
        user.role = data[i][2];
        user.status = data[i][3];
        break;
      }
    }
    return user;
  } catch (err) {
    Logger.log("Erreur getUserSession: " + err.toString());
    throw new Error("Impossible de charger la session : " + err.message);
  }
}

/**
 * Récupère la liste de tous les utilisateurs
 */
function getUsers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    const data = sheet.getDataRange().getValues();
    let users = [];
    for (let i = 1; i < data.length; i++) {
      users.push({
        email: data[i][0],
        name: data[i][1],
        role: data[i][2],
        status: data[i][3]
      });
    }
    return users;
  } catch (err) {
    Logger.log("Erreur getUsers: " + err.toString());
    return [];
  }
}

/**
 * Ajoute ou met à jour un utilisateur
 */
function saveUser(user) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toLowerCase() === user.email.toLowerCase()) {
        sheet.getRange(i + 1, 2, 1, 3).setValues([[user.name, user.role, user.status]]);
        return user.email;
      }
    }
    sheet.appendRow([user.email, user.name, user.role, user.status]);
    return user.email;
  } catch (err) {
    Logger.log("Erreur saveUser: " + err.toString());
    throw new Error("Impossible de sauvegarder l'utilisateur : " + err.message);
  }
}

/**
 * Supprime un utilisateur
 */
function deleteUser(email) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Users');
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toLowerCase() === email.toLowerCase()) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  } catch (err) {
    Logger.log("Erreur deleteUser: " + err.toString());
    return false;
  }
}

/* ─────────────────── CONFIGURATION ─────────────────── */

/**
 * Lit toutes les variables de configuration
 */
function getSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Settings');
    const data = sheet.getDataRange().getValues();
    let settings = {};
    for (let i = 1; i < data.length; i++) {
      settings[data[i][0]] = data[i][1];
    }
    return settings;
  } catch (err) {
    Logger.log("Erreur getSettings: " + err.toString());
    return {};
  }
}

/**
 * Met à jour ou insère une configuration
 */
function saveSetting(key, value) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Settings');
    const data = sheet.getDataRange().getValues();
    let found = false;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, value]);
    }
    return true;
  } catch (err) {
    Logger.log("Erreur saveSetting: " + err.toString());
    throw new Error("Impossible de sauvegarder le paramètre : " + err.message);
  }
}

/* ─────────────────── TÂCHES ─────────────────── */

/**
 * Récupère les tâches (optionnellement filtrées par entité)
 */
function getTasks(entity) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tasks');
    const data = sheet.getDataRange().getValues();
    let tasks = [];
    
    for (let i = 1; i < data.length; i++) {
      if (!entity || data[i][1] === entity) {
        let rawDate = data[i][4];
        let dateStr = '';
        try {
          dateStr = Utilities.formatDate(new Date(rawDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
        } catch(e) {
          dateStr = String(rawDate);
        }
        tasks.push({
          id: data[i][0],
          entity: data[i][1],
          title: data[i][2],
          assignee: data[i][3],
          dueDate: dateStr,
          priority: data[i][5],
          status: data[i][6]
        });
      }
    }
    return tasks;
  } catch (err) {
    Logger.log("Erreur getTasks: " + err.toString());
    return [];
  }
}

/**
 * Enregistre ou met à jour une tâche
 */
function saveTask(task) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tasks');
    const data = sheet.getDataRange().getValues();
    
    if (task.id) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === task.id) {
          sheet.getRange(i + 1, 2, 1, 6).setValues([
            [task.entity, task.title, task.assignee, task.dueDate, task.priority, task.status]
          ]);
          if (task.priority === 'Haute') syncToGoogleCalendar(task);
          return task.id;
        }
      }
    }
    const newId = "T-" + (data.length);
    sheet.appendRow([newId, task.entity, task.title, task.assignee, task.dueDate, task.priority, task.status]);
    task.id = newId;
    if (task.priority === 'Haute') syncToGoogleCalendar(task);
    return newId;
  } catch (err) {
    Logger.log("Erreur saveTask: " + err.toString());
    throw new Error("Impossible de sauvegarder la tâche : " + err.message);
  }
}

/**
 * Supprime une tâche
 */
function deleteTask(id) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Tasks');
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  } catch (err) {
    Logger.log("Erreur deleteTask: " + err.toString());
    return false;
  }
}

/* ─────────────────── CALENDRIER ─────────────────── */

/**
 * Synchronise les tâches à haute priorité avec Google Agenda
 */
function syncToGoogleCalendar(task) {
  try {
    const cal = CalendarApp.getDefaultCalendar();
    const title = '[OPAYS HQ] ' + task.title + ' — ' + task.assignee;
    const date = new Date(task.dueDate);
    
    const events = cal.getEventsForDay(date);
    for (let e of events) {
      if (e.getTitle() === title) return;
    }
    
    if (task.status !== 'Validé') {
      cal.createAllDayEvent(title, date, {
        description: 'Tâche Opays HQ. Entité: ' + task.entity + '. Priorité: ' + task.priority + '. Statut: ' + task.status
      });
    }
  } catch (err) {
    Logger.log("Erreur sync calendrier: " + err.toString());
  }
}

/**
 * Récupère les événements du Google Agenda pour un mois donné
 */
function getCalendarEventsForMonth(year, month) {
  try {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    
    const events = CalendarApp.getDefaultCalendar().getEvents(start, end);
    return events.map(function(e) {
      return {
        id: e.getId(),
        title: e.getTitle(),
        date: Utilities.formatDate(e.getStartTime(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
        startTime: Utilities.formatDate(e.getStartTime(), Session.getScriptTimeZone(), "HH:mm"),
        endTime: Utilities.formatDate(e.getEndTime(), Session.getScriptTimeZone(), "HH:mm"),
        description: e.getDescription() || '',
        location: e.getLocation() || '',
        isAllDay: e.isAllDayEvent(),
        type: 'calendar'
      };
    });
  } catch (err) {
    Logger.log("Erreur getCalendarEventsForMonth: " + err.toString());
    return [];
  }
}

/**
 * Rétrocompatibilité — récupère les événements du mois en cours
 */
function getGoogleCalendarEvents() {
  var now = new Date();
  return getCalendarEventsForMonth(now.getFullYear(), now.getMonth());
}

/**
 * Crée un événement dans Google Agenda
 */
function createCalendarEvent(eventData) {
  try {
    const cal = CalendarApp.getDefaultCalendar();
    let event;
    
    if (eventData.allDay) {
      event = cal.createAllDayEvent(eventData.title, new Date(eventData.date), {
        description: eventData.description || '',
        location: eventData.location || ''
      });
    } else {
      var startDate = new Date(eventData.date + 'T' + (eventData.startTime || '09:00') + ':00');
      var endDate = new Date(eventData.date + 'T' + (eventData.endTime || '10:00') + ':00');
      event = cal.createEvent(eventData.title, startDate, endDate, {
        description: eventData.description || '',
        location: eventData.location || ''
      });
    }
    
    return {
      id: event.getId(),
      title: event.getTitle(),
      date: eventData.date,
      startTime: eventData.startTime || '09:00',
      endTime: eventData.endTime || '10:00',
      isAllDay: !!eventData.allDay,
      type: 'calendar'
    };
  } catch (err) {
    Logger.log("Erreur createCalendarEvent: " + err.toString());
    throw new Error("Impossible de créer l'événement : " + err.message);
  }
}

/**
 * Supprime un événement du calendrier
 */
function deleteCalendarEvent(eventId) {
  try {
    var cal = CalendarApp.getDefaultCalendar();
    var event = cal.getEventById(eventId);
    if (event) {
      event.deleteEvent();
      return true;
    }
    return false;
  } catch (err) {
    Logger.log("Erreur deleteCalendarEvent: " + err.toString());
    return false;
  }
}

/* ─────────────────── CRM / CLIENTS ─────────────────── */

/**
 * Récupère les clients pour l'entité active
 */
function getClients(entity) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');
    const data = sheet.getDataRange().getValues();
    let clients = [];
    for (let i = 1; i < data.length; i++) {
      if (!entity || data[i][1] === entity) {
        clients.push({
          id: data[i][0],
          entity: data[i][1],
          name: data[i][2],
          pipelineStatus: data[i][3],
          budget: data[i][4],
          contact: data[i][5]
        });
      }
    }
    return clients;
  } catch (err) {
    Logger.log("Erreur getClients: " + err.toString());
    return [];
  }
}

/**
 * Enregistre ou modifie un client CRM
 */
function saveClient(client) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');
    const data = sheet.getDataRange().getValues();
    
    if (client.id) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === client.id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([
            [client.entity, client.name, client.pipelineStatus, client.budget, client.contact]
          ]);
          return client.id;
        }
      }
    }
    const newId = "C-" + (data.length);
    sheet.appendRow([newId, client.entity, client.name, client.pipelineStatus, client.budget, client.contact]);
    return newId;
  } catch (err) {
    Logger.log("Erreur saveClient: " + err.toString());
    throw new Error("Impossible de sauvegarder le client : " + err.message);
  }
}

/**
 * Supprime un client du CRM
 */
function deleteClient(id) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  } catch (err) {
    Logger.log("Erreur deleteClient: " + err.toString());
    return false;
  }
}

/* ─────────────────── FINANCES ─────────────────── */

/**
 * Récupère les écritures financières
 */
function getExpenses(entity) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Expenses');
    const data = sheet.getDataRange().getValues();
    let expenses = [];
    for (let i = 1; i < data.length; i++) {
      if (!entity || data[i][1] === entity) {
        let rawDate = data[i][4];
        let dateStr = '';
        try {
          dateStr = Utilities.formatDate(new Date(rawDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
        } catch(e) {
          dateStr = String(rawDate);
        }
        expenses.push({
          id: data[i][0],
          entity: data[i][1],
          title: data[i][2],
          amount: Number(data[i][3]),
          date: dateStr,
          category: data[i][5]
        });
      }
    }
    return expenses;
  } catch (err) {
    Logger.log("Erreur getExpenses: " + err.toString());
    return [];
  }
}

/**
 * Enregistre une transaction financière
 */
function saveExpense(exp) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Expenses');
    const data = sheet.getDataRange().getValues();
    if (exp.id) {
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === exp.id) {
          sheet.getRange(i + 1, 2, 1, 5).setValues([
            [exp.entity, exp.title, exp.amount, exp.date, exp.category]
          ]);
          return exp.id;
        }
      }
    }
    const newId = "E-" + (data.length);
    sheet.appendRow([newId, exp.entity, exp.title, exp.amount, exp.date, exp.category]);
    return newId;
  } catch (err) {
    Logger.log("Erreur saveExpense: " + err.toString());
    throw new Error("Impossible de sauvegarder la dépense : " + err.message);
  }
}

/**
 * Supprime une transaction
 */
function deleteExpense(id) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Expenses');
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  } catch (err) {
    Logger.log("Erreur deleteExpense: " + err.toString());
    return false;
  }
}

/* ─────────────────── GOOGLE DRIVE ─────────────────── */

/**
 * Explore un dossier Google Drive
 */
function getDriveDocuments(folderId) {
  try {
    let targetFolder;
    if (!folderId || folderId === 'root') {
      targetFolder = DriveApp.getRootFolder();
    } else {
      try {
        targetFolder = DriveApp.getFolderById(folderId);
      } catch(e) {
        targetFolder = DriveApp.getRootFolder();
      }
    }
    
    let files = [];
    let fileIterator = targetFolder.getFiles();
    while (fileIterator.hasNext()) {
      let f = fileIterator.next();
      files.push({
        id: f.getId(),
        name: f.getName(),
        mimeType: f.getMimeType(),
        url: f.getUrl(),
        lastUpdated: Utilities.formatDate(f.getLastUpdated(), Session.getScriptTimeZone(), "yyyy-MM-dd")
      });
    }
    return files;
  } catch (err) {
    Logger.log("Erreur getDriveDocuments: " + err.toString());
    return [];
  }
}

/**
 * Reçoit un fichier importé sous forme de base64 et l'enregistre dans Drive
 */
function uploadFileToDrive(folderId, base64Data, fileName, mimeType) {
  try {
    let folder = folderId && folderId !== 'root'
      ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
    let decodedData = Utilities.base64Decode(base64Data.split(",")[1]);
    let blob = Utilities.newBlob(decodedData, mimeType, fileName);
    let file = folder.createFile(blob);
    return { id: file.getId(), name: file.getName(), url: file.getUrl(), lastUpdated: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd") };
  } catch (err) {
    Logger.log("Erreur uploadFileToDrive: " + err.toString());
    throw new Error("Impossible d'uploader le fichier : " + err.message);
  }
}

/**
 * Met un fichier de Drive à la corbeille
 */
function deleteDriveFile(fileId) {
  try {
    DriveApp.getFileById(fileId).setTrashed(true);
    return true;
  } catch(e) {
    Logger.log("Erreur deleteDriveFile: " + e.toString());
    return false;
  }
}

/**
 * Crée un nouveau document Google (Doc, Sheet, Slide) dans le dossier cible
 */
function createNewGoogleFile(folderId, name, type) {
  try {
    let folder = folderId && folderId !== 'root'
      ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
    let file;
    if (type === 'doc') {
      let doc = DocumentApp.create(name);
      file = DriveApp.getFileById(doc.getId());
    } else if (type === 'sheet') {
      let sheet = SpreadsheetApp.create(name);
      file = DriveApp.getFileById(sheet.getId());
    } else {
      let slide = SlidesApp.create(name);
      file = DriveApp.getFileById(slide.getId());
    }
    if (folder.getId() !== DriveApp.getRootFolder().getId()) {
      file.moveTo(folder);
    }
    return {
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
      mimeType: file.getMimeType(),
      lastUpdated: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")
    };
  } catch (err) {
    Logger.log("Erreur createNewGoogleFile: " + err.toString());
    throw new Error("Impossible de créer le document : " + err.message);
  }
}

/* ─────────────────── GMAIL ─────────────────── */

/**
 * Envoie un email via l'API Gmail
 */
function sendGmailEmail(to, subject, body) {
  try {
    GmailApp.sendEmail(to, subject, body, {
      name: "Opays HQ — Platform",
      replyTo: Session.getActiveUser().getEmail()
    });
    return true;
  } catch (err) {
    Logger.log("Erreur sendGmailEmail: " + err.toString());
    throw new Error("Impossible d'envoyer l'email : " + err.message);
  }
}
