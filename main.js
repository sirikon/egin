#!/usr/bin/env gjs
imports.searchPath.unshift('.');
imports.gi.versions.Gtk = '3.0';
const {Gtk} = imports.gi;
const {app} = imports.src.app;
Gtk.init(null);

app().then(() => {}, (err) => print(err));
Gtk.main();
