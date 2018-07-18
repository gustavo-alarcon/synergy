import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-generar-orp",
  templateUrl: "./generar-orp.component.html",
  styleUrls: ["./generar-orp.component.css"]
})
export class GenerarOrpComponent implements OnInit {
  inputFile = {
    selectButton: {
      "background-color": "#fff",
      "border-radius": "10px",
      color: "#000"
    },
    clearButton: {
      "background-color": "#FFF",
      "border-radius": "10px",
      color: "#000",
      "margin-left": "10px"
    },
    layout: {
      "background-color": "#dadada",
      //"border-radius": "25px",
      color: "#888",
      "font-size": "10px",
      margin: "15px"
    },
    previewPanel: {
      "background-color": "#888",
      "border-radius": "0 0 10px 10px",
      display: "flex",
      "justify-content": "center"
    }
  };
  newImage;

  constructor(
    public DialogRef: MatDialogRef<GenerarOrpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {}

  onNoClick() {
    this.DialogRef.close("close");
  }

  imageFinishedUploading(file) {
    this.newImage = file.file;
  }

  onRemoved() {
    this.newImage = null;
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
