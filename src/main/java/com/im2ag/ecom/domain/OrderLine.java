package com.im2ag.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrderLine.
 */
@Entity
@Table(name = "order_line")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrderLine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Float unitPrice;

    @Column(name = "delivered")
    private Boolean delivered;

    @ManyToOne
    @JsonIgnoreProperties(value = { "images", "seller", "categories" }, allowSetters = true)
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lines", "appUser" }, allowSetters = true)
    private UserOrder userOrder;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrderLine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public OrderLine quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getUnitPrice() {
        return this.unitPrice;
    }

    public OrderLine unitPrice(Float unitPrice) {
        this.setUnitPrice(unitPrice);
        return this;
    }

    public void setUnitPrice(Float unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Boolean getDelivered() {
        return this.delivered;
    }

    public OrderLine delivered(Boolean delivered) {
        this.setDelivered(delivered);
        return this;
    }

    public void setDelivered(Boolean delivered) {
        this.delivered = delivered;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public OrderLine product(Product product) {
        this.setProduct(product);
        return this;
    }

    public UserOrder getUserOrder() {
        return this.userOrder;
    }

    public void setUserOrder(UserOrder userOrder) {
        this.userOrder = userOrder;
    }

    public OrderLine userOrder(UserOrder userOrder) {
        this.setUserOrder(userOrder);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderLine)) {
            return false;
        }
        return id != null && id.equals(((OrderLine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrderLine{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            ", unitPrice=" + getUnitPrice() +
            ", delivered='" + getDelivered() + "'" +
            "}";
    }
}
