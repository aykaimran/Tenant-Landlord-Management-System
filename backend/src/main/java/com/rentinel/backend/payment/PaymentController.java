package com.rentinel.backend.payment;

import org.springframework.http.HttpStatus;

import com.stripe.Stripe;
// import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct; // Changed from javax to jakarta
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("paymentController2")
@RequestMapping(path = "/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey; // Fixed typo (was Stripe)
    }

    @GetMapping("/tenant")
    public List<Payment> getPaymentsByTenantUsername(@RequestParam String username) {
        return paymentService.getPaymentsByTenantUsername(username);
    }

    @GetMapping("/tenant/{id}")
    public ResponseEntity<Payment> getTenantPaymentById(
            @PathVariable int id,
            @RequestParam String username) {
        Payment payment = paymentService.getPaymentForTenant(id, username);
        return ResponseEntity.ok(payment);
    }

    // Existing methods remain unchanged
    @PutMapping("/{id}")
    public void updatePayment(@PathVariable("id") int id,
            @RequestBody Payment updatedPayment,
            @RequestParam String tenantUserName,
            @RequestParam String ownerUserName,
            @RequestParam int propertyID) {
        paymentService.updatePayment(id, updatedPayment, tenantUserName, ownerUserName, propertyID);
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable("id") int id) {
        return paymentService.getPaymentById(id);
    }

    @PostMapping("/save")
    public ResponseEntity<Payment> savePaymentWithRelations(
            @RequestBody Payment payment,
            @RequestParam String tenantUserName,
            @RequestParam String ownerUserName,
            @RequestParam int propertyID) {

        Payment saved = paymentService.savePayment(payment, tenantUserName, ownerUserName, propertyID);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/stripe-payment")
    public ResponseEntity<Map<String, Object>> createStripePayment(
            @RequestBody Map<String, Object> paymentRequest) {

        try {
            // Log the incoming request
            System.out.println("Received payment request: " + paymentRequest);

            // Validate input
            if (!paymentRequest.containsKey("amount")) {
                throw new RuntimeException("Amount is required");
            }

            // Convert amount to the smallest currency unit (e.g., paisa for PKR)
            long amount = Long.parseLong(paymentRequest.get("amount").toString()) * 100;
            String currency = paymentRequest.getOrDefault("currency", "pkr").toString().toLowerCase();

            // Log the processed amount and currency
            System.out.println("Processed amount: " + amount + ", currency: " + currency);

            // Create payment intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency(currency)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Return response
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            response.put("status", intent.getStatus()); // Use actual status from Stripe
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Zahra's Added Code:
    // Get total payments made by a tenant
    @GetMapping("/total-payments/{userName}")
    public ResponseEntity<Double> getTotalPayments(@PathVariable String userName) {
        double totalPayments = paymentService.getTotalPaymentsMade(userName);
        return ResponseEntity.ok(totalPayments);
    }

    @GetMapping("/monthly-payments/{userName}")
    public ResponseEntity<?> getMonthlyPayments(@PathVariable String userName) {
        try {
            List<Map<String, Object>> payments = paymentService.getMonthlyPayments(userName);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}