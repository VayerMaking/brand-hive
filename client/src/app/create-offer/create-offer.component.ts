import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AccountServiceService } from '../_services/AccountService.service';
import { ProductServiceService } from '../_services/ProductService.service';
import { AngularFireStorage } from "@angular/fire/storage";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

  @Output() cancelCreateoffer = new EventEmitter();
  model: any = {};
  selectedFile: File = null;
  destroy$: Subject<null> = new Subject();
  typesLoaded: boolean = false;
  brands: any
  baseUrl = "https://localhost:5001/";
  types: any;
  sizes: any;
  fb;
  downloadURL: Observable<string>;
  

  fileToUpload: File;
  kittyImagePreview: string | ArrayBuffer;
  pictureForm: FormGroup;
  user: firebase.default.User;


  
  constructor(private accountService: AccountServiceService,
     private router: Router,
     private ps: ProductServiceService,
     private http: HttpClient,
     private toastr: ToastrService,
     private storage: AngularFireStorage,
     private store: AngularFirestore,
     private readonly formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getTypes()
    this.getSizes()
    this.pictureForm = this.formBuilder.group({
      photo: [null, Validators.required],
      description: [null, Validators.required],
    });
    this.pictureForm
      .get('photo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        this.handleFileChange(newValue.files);
      });


  }

  handleFileChange([ kittyImage ]) {
    this.fileToUpload = kittyImage;
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.kittyImagePreview = 
    loadEvent.target.result);
    reader.readAsDataURL(kittyImage);
  }


  cancel(){
    console.log("canceled");
    //this.cancelCreateoffer.emit(false);
    this.router.navigate(['home'])
  }

  getTypes(){
    console.log(this.accountService.getCurrentUser()['token'])
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer '+this.accountService.getCurrentUser()['token'])
    }
    this.http.get(this.baseUrl+'product/types/getAll',header).pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.typesLoaded=true;
      this.types = response;
      console.log(response[0])
    }, error => {
      console.log(error.error);
    })
  }

  getSizes(){
    this.http.get(this.baseUrl+'product/sizes/getAll', {
      params: new HttpParams().set("ProductTypeId", this.model.ProductTypeId)
    }).pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.sizes = response;
      console.log(response[0])
    }, error => {
      console.log(error.error);
    })
  }
  createOffer() {


    this.uploadImage(this.model['Name'])

  }
  onFileSelected(event) {
    console.log(event.target.files[0]['name'])
    if (!event.target.files[0]['name'].endsWith(".jpg")){
      
        this.toastr.error("This doesn't seem like an image", "Invalid file");
        return
    }

    
    this.selectedFile = event.target.files[0];

  }

  saveOffer(photoUrl : string){
    this.model['PictureUrl']=photoUrl
    this.model['Price']=Number(this.model['Price'])
    var myTypeId=0;
    var mySizeId=0;
    console.log(this.model)
    this.sizes.forEach(size => {
      if( size["nameS"]==this.model['ProductSizeId']) mySizeId=size['id']
    });

    


    
   this.http.post(this.baseUrl+'product/create', this.model).pipe(
    map((response: any) => {
      console.log(response);
    })
  ).subscribe(response => {
    
    this.router.navigate(['home'])
    this.toastr.success("Product " + this.model["Name"] + " listed successfuly!","New product listed")
  }, error => {
    console.log(error.error);
  }) 
  }

  uploadImage(productName: string){
    var n = Date.now();
    const filePath = "ProductPhotos/"+productName+"/"+n;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            this.saveOffer(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  revealSizes() {
    return this.model.ProductSizeId == null
  }
}
