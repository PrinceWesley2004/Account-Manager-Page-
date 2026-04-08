import { LightningElement, track, wire } from 'lwc';
import { refreshApex }    from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAllAccounts      from '@salesforce/apex/AccountService.getAllAccounts';
import createAccount      from '@salesforce/apex/AccountService.createAccount';
import deleteAccount      from '@salesforce/apex/AccountService.deleteAccount';

export default class AccountManager extends LightningElement {

    @track accounts    = [];
    @track isLoading   = true;
    @track newName     = '';
    @track newPhone    = '';
    @track newIndustry = 'Technology';

    _wiredResult;

    // ── Table columns ────────────────────────────
    columns = [
        { label: 'Name',     fieldName: 'Name',          type: 'text'     },
        { label: 'Industry', fieldName: 'Industry',       type: 'text'     },
        { label: 'Phone',    fieldName: 'Phone',          type: 'phone'    },
        { label: 'Revenue',  fieldName: 'AnnualRevenue',  type: 'currency' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Delete', name: 'delete', iconName: 'utility:delete' }
                ]
            }
        }
    ];

    // ── Industry picklist options ─────────────────
    industryOptions = [
        { label: 'Technology',  value: 'Technology'  },
        { label: 'Finance',     value: 'Finance'     },
        { label: 'Healthcare',  value: 'Healthcare'  },
        { label: 'Retail',      value: 'Retail'      },
        { label: 'Education',   value: 'Education'   },
    ];

    // ── Wire: load accounts ───────────────────────
    @wire(getAllAccounts)
    wiredAccounts(result) {
        this._wiredResult = result;
        if (result.data) {
            this.accounts  = result.data;
            this.isLoading = false;
        } else if (result.error) {
            this.showToast('Error', result.error.body.message, 'error');
            this.isLoading = false;
        }
    }

    // ── Input handlers ────────────────────────────
    handleNameChange(e)     { this.newName     = e.detail.value; }
    handlePhoneChange(e)    { this.newPhone    = e.detail.value; }
    handleIndustryChange(e) { this.newIndustry = e.detail.value; }

    // ── Create Account ────────────────────────────
    handleCreate() {
        if (!this.newName) {
            this.showToast('Validation', 'Account Name is required.', 'warning');
            return;
        }
        this.isLoading = true;
        createAccount({ name: this.newName, industry: this.newIndustry, phone: this.newPhone })
            .then(() => {
                this.showToast('Success', 'Account created!', 'success');
                this.newName = this.newPhone = '';
                return refreshApex(this._wiredResult);
            })
            .catch(err => this.showToast('Error', err.body.message, 'error'))
            .finally(() => { this.isLoading = false; });
    }

    // ── Row Action: Delete ────────────────────────
    handleRowAction(event) {
        const action    = event.detail.action;
        const accountId = event.detail.row.Id;

        if (action.name === 'delete') {
            this.isLoading = true;
            deleteAccount({ accountId })
                .then(() => {
                    this.showToast('Deleted', 'Account removed.', 'success');
                    return refreshApex(this._wiredResult);
                })
                .catch(err => this.showToast('Error', err.body.message, 'error'))
                .finally(() => { this.isLoading = false; });
        }
    }

    // ── Toast helper ──────────────────────────────
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}