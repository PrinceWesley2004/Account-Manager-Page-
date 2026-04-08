public with sharing class AccountService {

    // ── Get all Accounts ──────────────────────────
    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccounts() {
        return [
            SELECT Id, Name, Industry, Phone, Website, AnnualRevenue
            FROM   Account
            ORDER BY Name ASC
            LIMIT  100
        ];
    }

    // ── Create a new Account ──────────────────────
    @AuraEnabled
    public static Account createAccount(String name, String industry, String phone) {
        Account acc  = new Account();
        acc.Name     = name;
        acc.Industry = industry;
        acc.Phone    = phone;
        insert acc;
        return acc;
    }

    // ── Update an Account ─────────────────────────
    @AuraEnabled
    public static void updateAccount(Id accountId, String name, String phone) {
        Account acc = new Account(Id = accountId);
        acc.Name    = name;
        acc.Phone   = phone;
        update acc;
    }

    // ── Delete an Account ─────────────────────────
    @AuraEnabled
    public static void deleteAccount(Id accountId) {
        delete new Account(Id = accountId);
    }
}