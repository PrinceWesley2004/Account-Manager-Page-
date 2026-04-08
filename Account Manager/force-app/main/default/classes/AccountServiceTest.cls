@IsTest
private class AccountServiceTest {

    @TestSetup
    static void setup() {
        List<Account> accs = new List<Account>();
        for (Integer i = 0; i < 5; i++) {
            accs.add(new Account(Name = 'Test Account ' + i, Industry = 'Technology'));
        }
        insert accs;
    }

    @IsTest
    static void testGetAllAccounts() {
        Test.startTest();
        List<Account> result = AccountService.getAllAccounts();
        Test.stopTest();
        System.assert(result.size() > 0, 'Should return accounts');
    }

    @IsTest
    static void testCreateAccount() {
        Test.startTest();
        Account acc = AccountService.createAccount('New Corp', 'Finance', '1234567890');
        Test.stopTest();
        System.assertNotEquals(null, acc.Id, 'Account should be created');
    }

    @IsTest
    static void testDeleteAccount() {
        Account acc = [SELECT Id FROM Account LIMIT 1];
        Test.startTest();
        AccountService.deleteAccount(acc.Id);
        Test.stopTest();
        Integer count = [SELECT COUNT() FROM Account WHERE Id = :acc.Id];
        System.assertEquals(0, count, 'Account should be deleted');
    }
}