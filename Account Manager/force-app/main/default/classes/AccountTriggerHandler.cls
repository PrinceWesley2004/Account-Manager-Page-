public with sharing class AccountTriggerHandler {

    // ── Before Insert: Set default industry if blank ──
    public void onBeforeInsert(List<Account> newList) {
        for (Account acc : newList) {
            if (String.isBlank(acc.Industry)) {
                acc.Industry = 'Technology';
            }
            if (acc.Rating == null) {
                acc.Rating = 'Warm';
            }
        }
    }

    // ── Before Update: Prevent clearing Name ──────────
    public void onBeforeUpdate(List<Account> newList, Map<Id, Account> oldMap) {
        for (Account acc : newList) {
            if (String.isBlank(acc.Name)) {
                acc.Name.addError('Account Name cannot be blank.');
            }
        }
    }

    // ── After Insert: Log creation ────────────────────
    public void onAfterInsert(List<Account> newList) {
        System.debug('Accounts inserted: ' + newList.size());
    }

    // ── After Update: Log updates ─────────────────────
    public void onAfterUpdate(List<Account> newList, Map<Id, Account> oldMap) {
        for (Account acc : newList) {
            Account old = oldMap.get(acc.Id);
            if (acc.Name != old.Name) {
                System.debug('Account renamed: ' + old.Name + ' → ' + acc.Name);
            }
        }
    }
}