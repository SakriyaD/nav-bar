import { Component } from '@angular/core';

@Component({
  selector: 'app-salesman',
  imports: [],
  template: `
    <div class="salesman-container">
      <h1>Salesman:</h1>
      <div class="action">
        <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add</button>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Sales Form</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form action="" class="sales-orm">
                <div class="mb-3">
                  <label class="col-form-label" for="customer">
                    Customer: 
                    <input type="text" class= "form-control" placeholder="Customer's name">
                  </label> 
                </div>
                <div class="mb-3">
                  <label class="col-form-label" for="mobile">
                    Customer Mobile:
                    <input type="text" class= "form-control" placeholder="Mobile no.">
                  </label> 
                </div>
                <div class="mb-3">
                  <label class="col-form-label" for="address">
                    Customer address:
                    <input type="text" class= "form-control" placeholder="Address" >
                  </label>
                </div>
                        
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div class="product-content">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Rates</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <th scope="row">Coco-cola</th>
              <td>75</td>
              <td>2</td>
              <td>150</td>
            </tr>
            <tr>
              <th scope="row">Chowmein</th>
              <td>150</td>
              <td>2</td>
              <td>300</td>
            </tr>
            <tr>
              <th scope="row">Sprite</th>
              <td>75</td>
              <td>2</td>
              <td>150</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  `,
  styleUrl: './salesman.css',
})
export class Salesman {

}
